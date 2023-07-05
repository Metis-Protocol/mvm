// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package seqset

import (
	"math/big"
	"strings"

	ethereum "github.com/ethereum-optimism/optimism/l2geth"
	"github.com/ethereum-optimism/optimism/l2geth/accounts/abi"
	"github.com/ethereum-optimism/optimism/l2geth/accounts/abi/bind"
	"github.com/ethereum-optimism/optimism/l2geth/common"
	"github.com/ethereum-optimism/optimism/l2geth/core/types"
	"github.com/ethereum-optimism/optimism/l2geth/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = abi.U256
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// SeqsetABI is the input ABI used to generate the binding from.
const SeqsetABI = "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"endBlock\",\"type\":\"uint256\"}],\"name\":\"NewEpoch\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"newSigner\",\"type\":\"address\"}],\"name\":\"ReCommitEpoch\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"FIRST_END_BLOCK\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MPC_ADDRESS\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"SPRINT\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_newMpc\",\"type\":\"address\"}],\"name\":\"SetMpcOwner\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newEpoch\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endBlock\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"signer\",\"type\":\"address\"}],\"name\":\"commitEpoch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"currentEpochNumber\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"currentSprint\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"epochNumbers\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"epochs\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"number\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"number\",\"type\":\"uint256\"}],\"name\":\"getEpochByBlock\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getInitialSequencer\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"number\",\"type\":\"uint256\"}],\"name\":\"getMetisSequencer\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"oldEpoch\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"newSigner\",\"type\":\"address\"}],\"name\":\"recommitEpoch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"

// Seqset is an auto generated Go binding around an Ethereum contract.
type Seqset struct {
	SeqsetCaller     // Read-only binding to the contract
	SeqsetTransactor // Write-only binding to the contract
	SeqsetFilterer   // Log filterer for contract events
}

// SeqsetCaller is an auto generated read-only Go binding around an Ethereum contract.
type SeqsetCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SeqsetTransactor is an auto generated write-only Go binding around an Ethereum contract.
type SeqsetTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SeqsetFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type SeqsetFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SeqsetSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type SeqsetSession struct {
	Contract     *Seqset           // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// SeqsetCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type SeqsetCallerSession struct {
	Contract *SeqsetCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// SeqsetTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type SeqsetTransactorSession struct {
	Contract     *SeqsetTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// SeqsetRaw is an auto generated low-level Go binding around an Ethereum contract.
type SeqsetRaw struct {
	Contract *Seqset // Generic contract binding to access the raw methods on
}

// SeqsetCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type SeqsetCallerRaw struct {
	Contract *SeqsetCaller // Generic read-only contract binding to access the raw methods on
}

// SeqsetTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type SeqsetTransactorRaw struct {
	Contract *SeqsetTransactor // Generic write-only contract binding to access the raw methods on
}

// NewSeqset creates a new instance of Seqset, bound to a specific deployed contract.
func NewSeqset(address common.Address, backend bind.ContractBackend) (*Seqset, error) {
	contract, err := bindSeqset(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Seqset{SeqsetCaller: SeqsetCaller{contract: contract}, SeqsetTransactor: SeqsetTransactor{contract: contract}, SeqsetFilterer: SeqsetFilterer{contract: contract}}, nil
}

// NewSeqsetCaller creates a new read-only instance of Seqset, bound to a specific deployed contract.
func NewSeqsetCaller(address common.Address, caller bind.ContractCaller) (*SeqsetCaller, error) {
	contract, err := bindSeqset(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &SeqsetCaller{contract: contract}, nil
}

// NewSeqsetTransactor creates a new write-only instance of Seqset, bound to a specific deployed contract.
func NewSeqsetTransactor(address common.Address, transactor bind.ContractTransactor) (*SeqsetTransactor, error) {
	contract, err := bindSeqset(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &SeqsetTransactor{contract: contract}, nil
}

// NewSeqsetFilterer creates a new log filterer instance of Seqset, bound to a specific deployed contract.
func NewSeqsetFilterer(address common.Address, filterer bind.ContractFilterer) (*SeqsetFilterer, error) {
	contract, err := bindSeqset(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &SeqsetFilterer{contract: contract}, nil
}

// bindSeqset binds a generic wrapper to an already deployed contract.
func bindSeqset(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(SeqsetABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Seqset *SeqsetRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _Seqset.Contract.SeqsetCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Seqset *SeqsetRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Seqset.Contract.SeqsetTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Seqset *SeqsetRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Seqset.Contract.SeqsetTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Seqset *SeqsetCallerRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _Seqset.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Seqset *SeqsetTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Seqset.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Seqset *SeqsetTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Seqset.Contract.contract.Transact(opts, method, params...)
}

// FIRSTENDBLOCK is a free data retrieval call binding the contract method 0x66332354.
//
// Solidity: function FIRST_END_BLOCK() constant returns(uint256)
func (_Seqset *SeqsetCaller) FIRSTENDBLOCK(opts *bind.CallOpts) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "FIRST_END_BLOCK")
	return *ret0, err
}

// FIRSTENDBLOCK is a free data retrieval call binding the contract method 0x66332354.
//
// Solidity: function FIRST_END_BLOCK() constant returns(uint256)
func (_Seqset *SeqsetSession) FIRSTENDBLOCK() (*big.Int, error) {
	return _Seqset.Contract.FIRSTENDBLOCK(&_Seqset.CallOpts)
}

// FIRSTENDBLOCK is a free data retrieval call binding the contract method 0x66332354.
//
// Solidity: function FIRST_END_BLOCK() constant returns(uint256)
func (_Seqset *SeqsetCallerSession) FIRSTENDBLOCK() (*big.Int, error) {
	return _Seqset.Contract.FIRSTENDBLOCK(&_Seqset.CallOpts)
}

// MPCADDRESS is a free data retrieval call binding the contract method 0x8c167376.
//
// Solidity: function MPC_ADDRESS() constant returns(address)
func (_Seqset *SeqsetCaller) MPCADDRESS(opts *bind.CallOpts) (common.Address, error) {
	var (
		ret0 = new(common.Address)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "MPC_ADDRESS")
	return *ret0, err
}

// MPCADDRESS is a free data retrieval call binding the contract method 0x8c167376.
//
// Solidity: function MPC_ADDRESS() constant returns(address)
func (_Seqset *SeqsetSession) MPCADDRESS() (common.Address, error) {
	return _Seqset.Contract.MPCADDRESS(&_Seqset.CallOpts)
}

// MPCADDRESS is a free data retrieval call binding the contract method 0x8c167376.
//
// Solidity: function MPC_ADDRESS() constant returns(address)
func (_Seqset *SeqsetCallerSession) MPCADDRESS() (common.Address, error) {
	return _Seqset.Contract.MPCADDRESS(&_Seqset.CallOpts)
}

// SPRINT is a free data retrieval call binding the contract method 0x2bc06564.
//
// Solidity: function SPRINT() constant returns(uint256)
func (_Seqset *SeqsetCaller) SPRINT(opts *bind.CallOpts) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "SPRINT")
	return *ret0, err
}

// SPRINT is a free data retrieval call binding the contract method 0x2bc06564.
//
// Solidity: function SPRINT() constant returns(uint256)
func (_Seqset *SeqsetSession) SPRINT() (*big.Int, error) {
	return _Seqset.Contract.SPRINT(&_Seqset.CallOpts)
}

// SPRINT is a free data retrieval call binding the contract method 0x2bc06564.
//
// Solidity: function SPRINT() constant returns(uint256)
func (_Seqset *SeqsetCallerSession) SPRINT() (*big.Int, error) {
	return _Seqset.Contract.SPRINT(&_Seqset.CallOpts)
}

// CurrentEpochNumber is a free data retrieval call binding the contract method 0x6903beb4.
//
// Solidity: function currentEpochNumber() constant returns(uint256)
func (_Seqset *SeqsetCaller) CurrentEpochNumber(opts *bind.CallOpts) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "currentEpochNumber")
	return *ret0, err
}

// CurrentEpochNumber is a free data retrieval call binding the contract method 0x6903beb4.
//
// Solidity: function currentEpochNumber() constant returns(uint256)
func (_Seqset *SeqsetSession) CurrentEpochNumber() (*big.Int, error) {
	return _Seqset.Contract.CurrentEpochNumber(&_Seqset.CallOpts)
}

// CurrentEpochNumber is a free data retrieval call binding the contract method 0x6903beb4.
//
// Solidity: function currentEpochNumber() constant returns(uint256)
func (_Seqset *SeqsetCallerSession) CurrentEpochNumber() (*big.Int, error) {
	return _Seqset.Contract.CurrentEpochNumber(&_Seqset.CallOpts)
}

// CurrentSprint is a free data retrieval call binding the contract method 0xe3b7c924.
//
// Solidity: function currentSprint() constant returns(uint256)
func (_Seqset *SeqsetCaller) CurrentSprint(opts *bind.CallOpts) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "currentSprint")
	return *ret0, err
}

// CurrentSprint is a free data retrieval call binding the contract method 0xe3b7c924.
//
// Solidity: function currentSprint() constant returns(uint256)
func (_Seqset *SeqsetSession) CurrentSprint() (*big.Int, error) {
	return _Seqset.Contract.CurrentSprint(&_Seqset.CallOpts)
}

// CurrentSprint is a free data retrieval call binding the contract method 0xe3b7c924.
//
// Solidity: function currentSprint() constant returns(uint256)
func (_Seqset *SeqsetCallerSession) CurrentSprint() (*big.Int, error) {
	return _Seqset.Contract.CurrentSprint(&_Seqset.CallOpts)
}

// EpochNumbers is a free data retrieval call binding the contract method 0xe0bf78c1.
//
// Solidity: function epochNumbers(uint256 ) constant returns(uint256)
func (_Seqset *SeqsetCaller) EpochNumbers(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "epochNumbers", arg0)
	return *ret0, err
}

// EpochNumbers is a free data retrieval call binding the contract method 0xe0bf78c1.
//
// Solidity: function epochNumbers(uint256 ) constant returns(uint256)
func (_Seqset *SeqsetSession) EpochNumbers(arg0 *big.Int) (*big.Int, error) {
	return _Seqset.Contract.EpochNumbers(&_Seqset.CallOpts, arg0)
}

// EpochNumbers is a free data retrieval call binding the contract method 0xe0bf78c1.
//
// Solidity: function epochNumbers(uint256 ) constant returns(uint256)
func (_Seqset *SeqsetCallerSession) EpochNumbers(arg0 *big.Int) (*big.Int, error) {
	return _Seqset.Contract.EpochNumbers(&_Seqset.CallOpts, arg0)
}

// Epochs is a free data retrieval call binding the contract method 0xc6b61e4c.
//
// Solidity: function epochs(uint256 ) constant returns(uint256 number)
func (_Seqset *SeqsetCaller) Epochs(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "epochs", arg0)
	return *ret0, err
}

// Epochs is a free data retrieval call binding the contract method 0xc6b61e4c.
//
// Solidity: function epochs(uint256 ) constant returns(uint256 number)
func (_Seqset *SeqsetSession) Epochs(arg0 *big.Int) (*big.Int, error) {
	return _Seqset.Contract.Epochs(&_Seqset.CallOpts, arg0)
}

// Epochs is a free data retrieval call binding the contract method 0xc6b61e4c.
//
// Solidity: function epochs(uint256 ) constant returns(uint256 number)
func (_Seqset *SeqsetCallerSession) Epochs(arg0 *big.Int) (*big.Int, error) {
	return _Seqset.Contract.Epochs(&_Seqset.CallOpts, arg0)
}

// GetEpochByBlock is a free data retrieval call binding the contract method 0x46df33d2.
//
// Solidity: function getEpochByBlock(uint256 number) constant returns(uint256)
func (_Seqset *SeqsetCaller) GetEpochByBlock(opts *bind.CallOpts, number *big.Int) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "getEpochByBlock", number)
	return *ret0, err
}

// GetEpochByBlock is a free data retrieval call binding the contract method 0x46df33d2.
//
// Solidity: function getEpochByBlock(uint256 number) constant returns(uint256)
func (_Seqset *SeqsetSession) GetEpochByBlock(number *big.Int) (*big.Int, error) {
	return _Seqset.Contract.GetEpochByBlock(&_Seqset.CallOpts, number)
}

// GetEpochByBlock is a free data retrieval call binding the contract method 0x46df33d2.
//
// Solidity: function getEpochByBlock(uint256 number) constant returns(uint256)
func (_Seqset *SeqsetCallerSession) GetEpochByBlock(number *big.Int) (*big.Int, error) {
	return _Seqset.Contract.GetEpochByBlock(&_Seqset.CallOpts, number)
}

// GetInitialSequencer is a free data retrieval call binding the contract method 0x845e3dbe.
//
// Solidity: function getInitialSequencer() constant returns(address)
func (_Seqset *SeqsetCaller) GetInitialSequencer(opts *bind.CallOpts) (common.Address, error) {
	var (
		ret0 = new(common.Address)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "getInitialSequencer")
	return *ret0, err
}

// GetInitialSequencer is a free data retrieval call binding the contract method 0x845e3dbe.
//
// Solidity: function getInitialSequencer() constant returns(address)
func (_Seqset *SeqsetSession) GetInitialSequencer() (common.Address, error) {
	return _Seqset.Contract.GetInitialSequencer(&_Seqset.CallOpts)
}

// GetInitialSequencer is a free data retrieval call binding the contract method 0x845e3dbe.
//
// Solidity: function getInitialSequencer() constant returns(address)
func (_Seqset *SeqsetCallerSession) GetInitialSequencer() (common.Address, error) {
	return _Seqset.Contract.GetInitialSequencer(&_Seqset.CallOpts)
}

// GetMetisSequencer is a free data retrieval call binding the contract method 0x3edae769.
//
// Solidity: function getMetisSequencer(uint256 number) constant returns(address)
func (_Seqset *SeqsetCaller) GetMetisSequencer(opts *bind.CallOpts, number *big.Int) (common.Address, error) {
	var (
		ret0 = new(common.Address)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "getMetisSequencer", number)
	return *ret0, err
}

// GetMetisSequencer is a free data retrieval call binding the contract method 0x3edae769.
//
// Solidity: function getMetisSequencer(uint256 number) constant returns(address)
func (_Seqset *SeqsetSession) GetMetisSequencer(number *big.Int) (common.Address, error) {
	return _Seqset.Contract.GetMetisSequencer(&_Seqset.CallOpts, number)
}

// GetMetisSequencer is a free data retrieval call binding the contract method 0x3edae769.
//
// Solidity: function getMetisSequencer(uint256 number) constant returns(address)
func (_Seqset *SeqsetCallerSession) GetMetisSequencer(number *big.Int) (common.Address, error) {
	return _Seqset.Contract.GetMetisSequencer(&_Seqset.CallOpts, number)
}

// SetMpcOwner is a paid mutator transaction binding the contract method 0xdfa1d18e.
//
// Solidity: function SetMpcOwner(address _newMpc) returns()
func (_Seqset *SeqsetTransactor) SetMpcOwner(opts *bind.TransactOpts, _newMpc common.Address) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "SetMpcOwner", _newMpc)
}

// SetMpcOwner is a paid mutator transaction binding the contract method 0xdfa1d18e.
//
// Solidity: function SetMpcOwner(address _newMpc) returns()
func (_Seqset *SeqsetSession) SetMpcOwner(_newMpc common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.SetMpcOwner(&_Seqset.TransactOpts, _newMpc)
}

// SetMpcOwner is a paid mutator transaction binding the contract method 0xdfa1d18e.
//
// Solidity: function SetMpcOwner(address _newMpc) returns()
func (_Seqset *SeqsetTransactorSession) SetMpcOwner(_newMpc common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.SetMpcOwner(&_Seqset.TransactOpts, _newMpc)
}

// CommitEpoch is a paid mutator transaction binding the contract method 0x4fb71bdd.
//
// Solidity: function commitEpoch(uint256 newEpoch, uint256 startBlock, uint256 endBlock, address signer) returns()
func (_Seqset *SeqsetTransactor) CommitEpoch(opts *bind.TransactOpts, newEpoch *big.Int, startBlock *big.Int, endBlock *big.Int, signer common.Address) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "commitEpoch", newEpoch, startBlock, endBlock, signer)
}

// CommitEpoch is a paid mutator transaction binding the contract method 0x4fb71bdd.
//
// Solidity: function commitEpoch(uint256 newEpoch, uint256 startBlock, uint256 endBlock, address signer) returns()
func (_Seqset *SeqsetSession) CommitEpoch(newEpoch *big.Int, startBlock *big.Int, endBlock *big.Int, signer common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.CommitEpoch(&_Seqset.TransactOpts, newEpoch, startBlock, endBlock, signer)
}

// CommitEpoch is a paid mutator transaction binding the contract method 0x4fb71bdd.
//
// Solidity: function commitEpoch(uint256 newEpoch, uint256 startBlock, uint256 endBlock, address signer) returns()
func (_Seqset *SeqsetTransactorSession) CommitEpoch(newEpoch *big.Int, startBlock *big.Int, endBlock *big.Int, signer common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.CommitEpoch(&_Seqset.TransactOpts, newEpoch, startBlock, endBlock, signer)
}

// RecommitEpoch is a paid mutator transaction binding the contract method 0xfe4c8c3c.
//
// Solidity: function recommitEpoch(uint256 oldEpoch, uint256 startBlock, address newSigner) returns()
func (_Seqset *SeqsetTransactor) RecommitEpoch(opts *bind.TransactOpts, oldEpoch *big.Int, startBlock *big.Int, newSigner common.Address) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "recommitEpoch", oldEpoch, startBlock, newSigner)
}

// RecommitEpoch is a paid mutator transaction binding the contract method 0xfe4c8c3c.
//
// Solidity: function recommitEpoch(uint256 oldEpoch, uint256 startBlock, address newSigner) returns()
func (_Seqset *SeqsetSession) RecommitEpoch(oldEpoch *big.Int, startBlock *big.Int, newSigner common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.RecommitEpoch(&_Seqset.TransactOpts, oldEpoch, startBlock, newSigner)
}

// RecommitEpoch is a paid mutator transaction binding the contract method 0xfe4c8c3c.
//
// Solidity: function recommitEpoch(uint256 oldEpoch, uint256 startBlock, address newSigner) returns()
func (_Seqset *SeqsetTransactorSession) RecommitEpoch(oldEpoch *big.Int, startBlock *big.Int, newSigner common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.RecommitEpoch(&_Seqset.TransactOpts, oldEpoch, startBlock, newSigner)
}

// SeqsetNewEpochIterator is returned from FilterNewEpoch and is used to iterate over the raw logs and unpacked data for NewEpoch events raised by the Seqset contract.
type SeqsetNewEpochIterator struct {
	Event *SeqsetNewEpoch // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SeqsetNewEpochIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SeqsetNewEpoch)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SeqsetNewEpoch)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SeqsetNewEpochIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SeqsetNewEpochIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SeqsetNewEpoch represents a NewEpoch event raised by the Seqset contract.
type SeqsetNewEpoch struct {
	Id         *big.Int
	StartBlock *big.Int
	EndBlock   *big.Int
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterNewEpoch is a free log retrieval operation binding the contract event 0x3bb7b347508b7c148ec2094ac60d2e3d8b7595421025643f08b45cb78b326b58.
//
// Solidity: event NewEpoch(uint256 indexed id, uint256 indexed startBlock, uint256 indexed endBlock)
func (_Seqset *SeqsetFilterer) FilterNewEpoch(opts *bind.FilterOpts, id []*big.Int, startBlock []*big.Int, endBlock []*big.Int) (*SeqsetNewEpochIterator, error) {

	var idRule []interface{}
	for _, idItem := range id {
		idRule = append(idRule, idItem)
	}
	var startBlockRule []interface{}
	for _, startBlockItem := range startBlock {
		startBlockRule = append(startBlockRule, startBlockItem)
	}
	var endBlockRule []interface{}
	for _, endBlockItem := range endBlock {
		endBlockRule = append(endBlockRule, endBlockItem)
	}

	logs, sub, err := _Seqset.contract.FilterLogs(opts, "NewEpoch", idRule, startBlockRule, endBlockRule)
	if err != nil {
		return nil, err
	}
	return &SeqsetNewEpochIterator{contract: _Seqset.contract, event: "NewEpoch", logs: logs, sub: sub}, nil
}

// WatchNewEpoch is a free log subscription operation binding the contract event 0x3bb7b347508b7c148ec2094ac60d2e3d8b7595421025643f08b45cb78b326b58.
//
// Solidity: event NewEpoch(uint256 indexed id, uint256 indexed startBlock, uint256 indexed endBlock)
func (_Seqset *SeqsetFilterer) WatchNewEpoch(opts *bind.WatchOpts, sink chan<- *SeqsetNewEpoch, id []*big.Int, startBlock []*big.Int, endBlock []*big.Int) (event.Subscription, error) {

	var idRule []interface{}
	for _, idItem := range id {
		idRule = append(idRule, idItem)
	}
	var startBlockRule []interface{}
	for _, startBlockItem := range startBlock {
		startBlockRule = append(startBlockRule, startBlockItem)
	}
	var endBlockRule []interface{}
	for _, endBlockItem := range endBlock {
		endBlockRule = append(endBlockRule, endBlockItem)
	}

	logs, sub, err := _Seqset.contract.WatchLogs(opts, "NewEpoch", idRule, startBlockRule, endBlockRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SeqsetNewEpoch)
				if err := _Seqset.contract.UnpackLog(event, "NewEpoch", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseNewEpoch is a log parse operation binding the contract event 0x3bb7b347508b7c148ec2094ac60d2e3d8b7595421025643f08b45cb78b326b58.
//
// Solidity: event NewEpoch(uint256 indexed id, uint256 indexed startBlock, uint256 indexed endBlock)
func (_Seqset *SeqsetFilterer) ParseNewEpoch(log types.Log) (*SeqsetNewEpoch, error) {
	event := new(SeqsetNewEpoch)
	if err := _Seqset.contract.UnpackLog(event, "NewEpoch", log); err != nil {
		return nil, err
	}
	return event, nil
}

// SeqsetReCommitEpochIterator is returned from FilterReCommitEpoch and is used to iterate over the raw logs and unpacked data for ReCommitEpoch events raised by the Seqset contract.
type SeqsetReCommitEpochIterator struct {
	Event *SeqsetReCommitEpoch // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SeqsetReCommitEpochIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SeqsetReCommitEpoch)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SeqsetReCommitEpoch)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SeqsetReCommitEpochIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SeqsetReCommitEpochIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SeqsetReCommitEpoch represents a ReCommitEpoch event raised by the Seqset contract.
type SeqsetReCommitEpoch struct {
	Id         *big.Int
	StartBlock *big.Int
	NewSigner  common.Address
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterReCommitEpoch is a free log retrieval operation binding the contract event 0xc2733772c74f9c36c3f47ee84b45b41c612ae6a1027e7021863cdb93f9e212c4.
//
// Solidity: event ReCommitEpoch(uint256 indexed id, uint256 indexed startBlock, address newSigner)
func (_Seqset *SeqsetFilterer) FilterReCommitEpoch(opts *bind.FilterOpts, id []*big.Int, startBlock []*big.Int) (*SeqsetReCommitEpochIterator, error) {

	var idRule []interface{}
	for _, idItem := range id {
		idRule = append(idRule, idItem)
	}
	var startBlockRule []interface{}
	for _, startBlockItem := range startBlock {
		startBlockRule = append(startBlockRule, startBlockItem)
	}

	logs, sub, err := _Seqset.contract.FilterLogs(opts, "ReCommitEpoch", idRule, startBlockRule)
	if err != nil {
		return nil, err
	}
	return &SeqsetReCommitEpochIterator{contract: _Seqset.contract, event: "ReCommitEpoch", logs: logs, sub: sub}, nil
}

// WatchReCommitEpoch is a free log subscription operation binding the contract event 0xc2733772c74f9c36c3f47ee84b45b41c612ae6a1027e7021863cdb93f9e212c4.
//
// Solidity: event ReCommitEpoch(uint256 indexed id, uint256 indexed startBlock, address newSigner)
func (_Seqset *SeqsetFilterer) WatchReCommitEpoch(opts *bind.WatchOpts, sink chan<- *SeqsetReCommitEpoch, id []*big.Int, startBlock []*big.Int) (event.Subscription, error) {

	var idRule []interface{}
	for _, idItem := range id {
		idRule = append(idRule, idItem)
	}
	var startBlockRule []interface{}
	for _, startBlockItem := range startBlock {
		startBlockRule = append(startBlockRule, startBlockItem)
	}

	logs, sub, err := _Seqset.contract.WatchLogs(opts, "ReCommitEpoch", idRule, startBlockRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SeqsetReCommitEpoch)
				if err := _Seqset.contract.UnpackLog(event, "ReCommitEpoch", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseReCommitEpoch is a log parse operation binding the contract event 0xc2733772c74f9c36c3f47ee84b45b41c612ae6a1027e7021863cdb93f9e212c4.
//
// Solidity: event ReCommitEpoch(uint256 indexed id, uint256 indexed startBlock, address newSigner)
func (_Seqset *SeqsetFilterer) ParseReCommitEpoch(log types.Log) (*SeqsetReCommitEpoch, error) {
	event := new(SeqsetReCommitEpoch)
	if err := _Seqset.contract.UnpackLog(event, "ReCommitEpoch", log); err != nil {
		return nil, err
	}
	return event, nil
}
