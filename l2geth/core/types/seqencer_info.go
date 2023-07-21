package types

import (
	"github.com/ethereum-optimism/optimism/l2geth/common"
)

type SequencerInfo struct {
	SequencerAddress common.Address `json:"sequencerAddress"`
	SequencerUrl     string         `json:"sequencerUrl"`
}

type SequencerInfoList struct {
	SeqList []SequencerInfo `json:"seqList"`
}
