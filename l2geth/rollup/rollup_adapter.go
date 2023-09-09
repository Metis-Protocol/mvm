package rollup

import (
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"strconv"

	"github.com/ethereum-optimism/optimism/l2geth/contracts/checkpointoracle/contract/seqset"

	"github.com/ethereum-optimism/optimism/l2geth/common"
	"github.com/ethereum-optimism/optimism/l2geth/core/types"
	"github.com/ethereum-optimism/optimism/l2geth/ethclient"
	"github.com/ethereum-optimism/optimism/l2geth/log"
	"github.com/ethereum-optimism/optimism/l2geth/rollup/rcfg"
)

const (
	// RecommitEpoch is a paid mutator transaction binding the contract method 0x2c91c679.
	updateSeqMethod  = ("0x2c91c679")
	updateSeqDataLen = 4 + 32 + 32 + 32 + 32 + 32 // uint256 oldEpochId,uint256 newEpochId, uint256 startBlock,uint256 endBlock, address newSigner
)

// RollupAdapter is the adapter for decentralized seqencers
// that is required by the SyncService
type RollupAdapter interface {
	// get tx seqencer for checking tx is valid
	GetTxSeqencer(tx *types.Transaction, expectIndex uint64) (common.Address, error)
	// check current seqencer is working
	// CheckSeqencerIsWorking() bool
	//
	GetSeqValidHeight() uint64
	CheckPosLayerSynced() (bool, error)
}

// SeqAdapter is an adpater used by seqencer based RollupClient
type SeqAdapter struct {
	// posClient  // connnect to pos layer
	// l2client // connect to l2geth client
	l2SeqContract          common.Address // l2 seq contract address
	seqContractValidHeight uint64         // l2 seq contract valid height
	localL2Url             string
	localL2Conn            *ethclient.Client
	metisPosURL            string
	metisPosClient         *http.Client
}

func NewSeqAdapter(l2SeqContract common.Address, seqContractValidHeight uint64, posClientUrl, localL2Url string) *SeqAdapter {
	return &SeqAdapter{
		l2SeqContract:          l2SeqContract,
		seqContractValidHeight: seqContractValidHeight,
		metisPosURL:            posClientUrl,
		localL2Url:             localL2Url,

		metisPosClient: &http.Client{},
	}
}

func parseUpdateSeqData(data []byte) (bool, common.Address) {
	if len(data) < updateSeqDataLen {
		return false, common.HexToAddress("0x0")
	}
	method := hex.EncodeToString(data[0:4])
	address := common.BytesToAddress(data[4*32+16 : 4*32+36])
	if method == updateSeqMethod {
		return true, address
	}
	return false, common.HexToAddress("0x0")
}
func (s *SeqAdapter) getSeqencer(expectIndex uint64) (common.Address, error) {
	var err error
	if s.localL2Conn == nil {
		s.localL2Conn, err = ethclient.Dial(s.localL2Url)
	}
	if err != nil {
		return common.Address{}, err
	}
	seqContract, err := seqset.NewSeqset(s.l2SeqContract, s.localL2Conn)
	if err != nil {
		fmt.Println("connect contract err ", err)
		s.localL2Conn = nil
		return common.Address{}, err
	}
	return seqContract.GetMetisSequencer(nil, big.NewInt(int64(expectIndex)))

}
func (s *SeqAdapter) GetSeqValidHeight() uint64 {
	return s.seqContractValidHeight
}
func (s *SeqAdapter) GetTxSeqencer(tx *types.Transaction, expectIndex uint64) (common.Address, error) {
	// check is update seqencer operate
	if expectIndex <= s.seqContractValidHeight {
		// return default address 0x00000398232E2064F896018496b4b44b3D62751F
		return rcfg.DefaultSeqAdderss, nil
	}
	// if expectIndex%2 == 0 {
	// 	log.Debug("seqencer %v, for index %v", "0x00000398232E2064F896018496b4b44b3D62751F", expectIndex, "tx", tx.Hash().Hex())
	// 	return common.HexToAddress("0x00000398232E2064F896018496b4b44b3D62751F"), nil
	// }
	// log.Debug("seqencer %v, for index %v", "0xc213298c9e90e1ae7b4b97c95a7be1b811e7c933", expectIndex, "tx", tx.Hash().Hex())
	// return common.HexToAddress("0xc213298c9e90e1ae7b4b97c95a7be1b811e7c933"), nil

	if tx != nil {
		seqOper, data := tx.IsSystemContractCall(s.l2SeqContract)
		if seqOper {
			updateSeq, newSeq := parseUpdateSeqData(data)
			if updateSeq {
				return newSeq, nil
			}
		}
	}

	log.Debug("Will get seqencer info from seq contract on L2")
	// get status from contract on height expectIndex - 1
	// return result ,err
	address, err := s.getSeqencer(expectIndex)
	log.Info("GetTxSeqencer ", "getSeqencer address=", address, "expectIndex= ", expectIndex, "err=",  err)
	return address, err
}

// CheckSeqencerIsWorking check current seqencer is working
// func (s *SeqAdapter) CheckSeqencerIsWorking() bool {
// 	// check mempool and last tx id info
// 	return true
// }

func (s *SeqAdapter) CheckPosLayerSynced() (bool, error) {
	// get pos layer synced
	if s == nil {
		return false, errors.New("client is null")
	}
	path := fmt.Sprintf("%v/checkPosIsSynced", s.metisPosURL)
	resp, err := s.metisPosClient.Get(path)

	if err != nil {
		fmt.Println("error:", err)
		return false, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, err
	}
	//fmt.Println(string(body))

	return strconv.ParseBool(string(body))

}
