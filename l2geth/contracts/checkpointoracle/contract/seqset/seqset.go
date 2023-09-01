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
const SeqsetABI = "[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_newLength\",\"type\":\"uint256\"}],\"name\":\"EpochUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"_newMpcAddress\",\"type\":\"address\"}],\"name\":\"MpcAddressUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"epochId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"endBlock\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"signer\",\"type\":\"address\"}],\"name\":\"NewEpoch\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"oldEpochId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"newEpochId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"endBlock\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"newSigner\",\"type\":\"address\"}],\"name\":\"ReCommitEpoch\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_newLength\",\"type\":\"uint256\"}],\"name\":\"UpdateEpochLength\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_newMpc\",\"type\":\"address\"}],\"name\":\"UpdateMpcAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newEpoch\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endBlock\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"signer\",\"type\":\"address\"}],\"name\":\"commitEpoch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"currentEpochNumber\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"epochLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"epochNumbers\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"epochs\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"number\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"signer\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endBlock\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"firstEndBlock\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"number\",\"type\":\"uint256\"}],\"name\":\"getEpochByBlock\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"number\",\"type\":\"uint256\"}],\"name\":\"getMetisSequencer\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"initialSequencer\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_initialSequencer\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_mpcAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_firstEndBlock\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_epochLength\",\"type\":\"uint256\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"mpcAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"oldEpochId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"newEpochId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"startBlock\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endBlock\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"newSigner\",\"type\":\"address\"}],\"name\":\"recommitEpoch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"

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

// EpochLength is a free data retrieval call binding the contract method 0x57d775f8.
//
// Solidity: function epochLength() constant returns(uint256)
func (_Seqset *SeqsetCaller) EpochLength(opts *bind.CallOpts) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "epochLength")
	return *ret0, err
}

// EpochLength is a free data retrieval call binding the contract method 0x57d775f8.
//
// Solidity: function epochLength() constant returns(uint256)
func (_Seqset *SeqsetSession) EpochLength() (*big.Int, error) {
	return _Seqset.Contract.EpochLength(&_Seqset.CallOpts)
}

// EpochLength is a free data retrieval call binding the contract method 0x57d775f8.
//
// Solidity: function epochLength() constant returns(uint256)
func (_Seqset *SeqsetCallerSession) EpochLength() (*big.Int, error) {
	return _Seqset.Contract.EpochLength(&_Seqset.CallOpts)
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
// Solidity: function epochs(uint256 ) constant returns(uint256 number, address signer, uint256 startBlock, uint256 endBlock)
func (_Seqset *SeqsetCaller) Epochs(opts *bind.CallOpts, arg0 *big.Int) (struct {
	Number     *big.Int
	Signer     common.Address
	StartBlock *big.Int
	EndBlock   *big.Int
}, error) {
	ret := new(struct {
		Number     *big.Int
		Signer     common.Address
		StartBlock *big.Int
		EndBlock   *big.Int
	})
	out := ret
	err := _Seqset.contract.Call(opts, out, "epochs", arg0)
	return *ret, err
}

// Epochs is a free data retrieval call binding the contract method 0xc6b61e4c.
//
// Solidity: function epochs(uint256 ) constant returns(uint256 number, address signer, uint256 startBlock, uint256 endBlock)
func (_Seqset *SeqsetSession) Epochs(arg0 *big.Int) (struct {
	Number     *big.Int
	Signer     common.Address
	StartBlock *big.Int
	EndBlock   *big.Int
}, error) {
	return _Seqset.Contract.Epochs(&_Seqset.CallOpts, arg0)
}

// Epochs is a free data retrieval call binding the contract method 0xc6b61e4c.
//
// Solidity: function epochs(uint256 ) constant returns(uint256 number, address signer, uint256 startBlock, uint256 endBlock)
func (_Seqset *SeqsetCallerSession) Epochs(arg0 *big.Int) (struct {
	Number     *big.Int
	Signer     common.Address
	StartBlock *big.Int
	EndBlock   *big.Int
}, error) {
	return _Seqset.Contract.Epochs(&_Seqset.CallOpts, arg0)
}

// FirstEndBlock is a free data retrieval call binding the contract method 0x76a57d37.
//
// Solidity: function firstEndBlock() constant returns(uint256)
func (_Seqset *SeqsetCaller) FirstEndBlock(opts *bind.CallOpts) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "firstEndBlock")
	return *ret0, err
}

// FirstEndBlock is a free data retrieval call binding the contract method 0x76a57d37.
//
// Solidity: function firstEndBlock() constant returns(uint256)
func (_Seqset *SeqsetSession) FirstEndBlock() (*big.Int, error) {
	return _Seqset.Contract.FirstEndBlock(&_Seqset.CallOpts)
}

// FirstEndBlock is a free data retrieval call binding the contract method 0x76a57d37.
//
// Solidity: function firstEndBlock() constant returns(uint256)
func (_Seqset *SeqsetCallerSession) FirstEndBlock() (*big.Int, error) {
	return _Seqset.Contract.FirstEndBlock(&_Seqset.CallOpts)
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

// InitialSequencer is a free data retrieval call binding the contract method 0xc0f1d5a1.
//
// Solidity: function initialSequencer() constant returns(address)
func (_Seqset *SeqsetCaller) InitialSequencer(opts *bind.CallOpts) (common.Address, error) {
	var (
		ret0 = new(common.Address)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "initialSequencer")
	return *ret0, err
}

// InitialSequencer is a free data retrieval call binding the contract method 0xc0f1d5a1.
//
// Solidity: function initialSequencer() constant returns(address)
func (_Seqset *SeqsetSession) InitialSequencer() (common.Address, error) {
	return _Seqset.Contract.InitialSequencer(&_Seqset.CallOpts)
}

// InitialSequencer is a free data retrieval call binding the contract method 0xc0f1d5a1.
//
// Solidity: function initialSequencer() constant returns(address)
func (_Seqset *SeqsetCallerSession) InitialSequencer() (common.Address, error) {
	return _Seqset.Contract.InitialSequencer(&_Seqset.CallOpts)
}

// MpcAddress is a free data retrieval call binding the contract method 0x111f4630.
//
// Solidity: function mpcAddress() constant returns(address)
func (_Seqset *SeqsetCaller) MpcAddress(opts *bind.CallOpts) (common.Address, error) {
	var (
		ret0 = new(common.Address)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "mpcAddress")
	return *ret0, err
}

// MpcAddress is a free data retrieval call binding the contract method 0x111f4630.
//
// Solidity: function mpcAddress() constant returns(address)
func (_Seqset *SeqsetSession) MpcAddress() (common.Address, error) {
	return _Seqset.Contract.MpcAddress(&_Seqset.CallOpts)
}

// MpcAddress is a free data retrieval call binding the contract method 0x111f4630.
//
// Solidity: function mpcAddress() constant returns(address)
func (_Seqset *SeqsetCallerSession) MpcAddress() (common.Address, error) {
	return _Seqset.Contract.MpcAddress(&_Seqset.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() constant returns(address)
func (_Seqset *SeqsetCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var (
		ret0 = new(common.Address)
	)
	out := ret0
	err := _Seqset.contract.Call(opts, out, "owner")
	return *ret0, err
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() constant returns(address)
func (_Seqset *SeqsetSession) Owner() (common.Address, error) {
	return _Seqset.Contract.Owner(&_Seqset.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() constant returns(address)
func (_Seqset *SeqsetCallerSession) Owner() (common.Address, error) {
	return _Seqset.Contract.Owner(&_Seqset.CallOpts)
}

// UpdateEpochLength is a paid mutator transaction binding the contract method 0x24316ccb.
//
// Solidity: function UpdateEpochLength(uint256 _newLength) returns()
func (_Seqset *SeqsetTransactor) UpdateEpochLength(opts *bind.TransactOpts, _newLength *big.Int) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "UpdateEpochLength", _newLength)
}

// UpdateEpochLength is a paid mutator transaction binding the contract method 0x24316ccb.
//
// Solidity: function UpdateEpochLength(uint256 _newLength) returns()
func (_Seqset *SeqsetSession) UpdateEpochLength(_newLength *big.Int) (*types.Transaction, error) {
	return _Seqset.Contract.UpdateEpochLength(&_Seqset.TransactOpts, _newLength)
}

// UpdateEpochLength is a paid mutator transaction binding the contract method 0x24316ccb.
//
// Solidity: function UpdateEpochLength(uint256 _newLength) returns()
func (_Seqset *SeqsetTransactorSession) UpdateEpochLength(_newLength *big.Int) (*types.Transaction, error) {
	return _Seqset.Contract.UpdateEpochLength(&_Seqset.TransactOpts, _newLength)
}

// UpdateMpcAddress is a paid mutator transaction binding the contract method 0x643dbfce.
//
// Solidity: function UpdateMpcAddress(address _newMpc) returns()
func (_Seqset *SeqsetTransactor) UpdateMpcAddress(opts *bind.TransactOpts, _newMpc common.Address) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "UpdateMpcAddress", _newMpc)
}

// UpdateMpcAddress is a paid mutator transaction binding the contract method 0x643dbfce.
//
// Solidity: function UpdateMpcAddress(address _newMpc) returns()
func (_Seqset *SeqsetSession) UpdateMpcAddress(_newMpc common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.UpdateMpcAddress(&_Seqset.TransactOpts, _newMpc)
}

// UpdateMpcAddress is a paid mutator transaction binding the contract method 0x643dbfce.
//
// Solidity: function UpdateMpcAddress(address _newMpc) returns()
func (_Seqset *SeqsetTransactorSession) UpdateMpcAddress(_newMpc common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.UpdateMpcAddress(&_Seqset.TransactOpts, _newMpc)
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

// Initialize is a paid mutator transaction binding the contract method 0xeb990c59.
//
// Solidity: function initialize(address _initialSequencer, address _mpcAddress, uint256 _firstEndBlock, uint256 _epochLength) returns()
func (_Seqset *SeqsetTransactor) Initialize(opts *bind.TransactOpts, _initialSequencer common.Address, _mpcAddress common.Address, _firstEndBlock *big.Int, _epochLength *big.Int) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "initialize", _initialSequencer, _mpcAddress, _firstEndBlock, _epochLength)
}

// Initialize is a paid mutator transaction binding the contract method 0xeb990c59.
//
// Solidity: function initialize(address _initialSequencer, address _mpcAddress, uint256 _firstEndBlock, uint256 _epochLength) returns()
func (_Seqset *SeqsetSession) Initialize(_initialSequencer common.Address, _mpcAddress common.Address, _firstEndBlock *big.Int, _epochLength *big.Int) (*types.Transaction, error) {
	return _Seqset.Contract.Initialize(&_Seqset.TransactOpts, _initialSequencer, _mpcAddress, _firstEndBlock, _epochLength)
}

// Initialize is a paid mutator transaction binding the contract method 0xeb990c59.
//
// Solidity: function initialize(address _initialSequencer, address _mpcAddress, uint256 _firstEndBlock, uint256 _epochLength) returns()
func (_Seqset *SeqsetTransactorSession) Initialize(_initialSequencer common.Address, _mpcAddress common.Address, _firstEndBlock *big.Int, _epochLength *big.Int) (*types.Transaction, error) {
	return _Seqset.Contract.Initialize(&_Seqset.TransactOpts, _initialSequencer, _mpcAddress, _firstEndBlock, _epochLength)
}

// RecommitEpoch is a paid mutator transaction binding the contract method 0x2c91c679.
//
// Solidity: function recommitEpoch(uint256 oldEpochId, uint256 newEpochId, uint256 startBlock, uint256 endBlock, address newSigner) returns()
func (_Seqset *SeqsetTransactor) RecommitEpoch(opts *bind.TransactOpts, oldEpochId *big.Int, newEpochId *big.Int, startBlock *big.Int, endBlock *big.Int, newSigner common.Address) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "recommitEpoch", oldEpochId, newEpochId, startBlock, endBlock, newSigner)
}

// RecommitEpoch is a paid mutator transaction binding the contract method 0x2c91c679.
//
// Solidity: function recommitEpoch(uint256 oldEpochId, uint256 newEpochId, uint256 startBlock, uint256 endBlock, address newSigner) returns()
func (_Seqset *SeqsetSession) RecommitEpoch(oldEpochId *big.Int, newEpochId *big.Int, startBlock *big.Int, endBlock *big.Int, newSigner common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.RecommitEpoch(&_Seqset.TransactOpts, oldEpochId, newEpochId, startBlock, endBlock, newSigner)
}

// RecommitEpoch is a paid mutator transaction binding the contract method 0x2c91c679.
//
// Solidity: function recommitEpoch(uint256 oldEpochId, uint256 newEpochId, uint256 startBlock, uint256 endBlock, address newSigner) returns()
func (_Seqset *SeqsetTransactorSession) RecommitEpoch(oldEpochId *big.Int, newEpochId *big.Int, startBlock *big.Int, endBlock *big.Int, newSigner common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.RecommitEpoch(&_Seqset.TransactOpts, oldEpochId, newEpochId, startBlock, endBlock, newSigner)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Seqset *SeqsetTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Seqset *SeqsetSession) RenounceOwnership() (*types.Transaction, error) {
	return _Seqset.Contract.RenounceOwnership(&_Seqset.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Seqset *SeqsetTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _Seqset.Contract.RenounceOwnership(&_Seqset.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Seqset *SeqsetTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _Seqset.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Seqset *SeqsetSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.TransferOwnership(&_Seqset.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Seqset *SeqsetTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Seqset.Contract.TransferOwnership(&_Seqset.TransactOpts, newOwner)
}

// SeqsetEpochUpdatedIterator is returned from FilterEpochUpdated and is used to iterate over the raw logs and unpacked data for EpochUpdated events raised by the Seqset contract.
type SeqsetEpochUpdatedIterator struct {
	Event *SeqsetEpochUpdated // Event containing the contract specifics and raw log

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
func (it *SeqsetEpochUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SeqsetEpochUpdated)
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
		it.Event = new(SeqsetEpochUpdated)
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
func (it *SeqsetEpochUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SeqsetEpochUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SeqsetEpochUpdated represents a EpochUpdated event raised by the Seqset contract.
type SeqsetEpochUpdated struct {
	NewLength *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterEpochUpdated is a free log retrieval operation binding the contract event 0xb33a1f54dde4e0082c45281b338d78b2c4b5be163b6ffffa5d0d6d1050ba5a58.
//
// Solidity: event EpochUpdated(uint256 _newLength)
func (_Seqset *SeqsetFilterer) FilterEpochUpdated(opts *bind.FilterOpts) (*SeqsetEpochUpdatedIterator, error) {

	logs, sub, err := _Seqset.contract.FilterLogs(opts, "EpochUpdated")
	if err != nil {
		return nil, err
	}
	return &SeqsetEpochUpdatedIterator{contract: _Seqset.contract, event: "EpochUpdated", logs: logs, sub: sub}, nil
}

// WatchEpochUpdated is a free log subscription operation binding the contract event 0xb33a1f54dde4e0082c45281b338d78b2c4b5be163b6ffffa5d0d6d1050ba5a58.
//
// Solidity: event EpochUpdated(uint256 _newLength)
func (_Seqset *SeqsetFilterer) WatchEpochUpdated(opts *bind.WatchOpts, sink chan<- *SeqsetEpochUpdated) (event.Subscription, error) {

	logs, sub, err := _Seqset.contract.WatchLogs(opts, "EpochUpdated")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SeqsetEpochUpdated)
				if err := _Seqset.contract.UnpackLog(event, "EpochUpdated", log); err != nil {
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

// ParseEpochUpdated is a log parse operation binding the contract event 0xb33a1f54dde4e0082c45281b338d78b2c4b5be163b6ffffa5d0d6d1050ba5a58.
//
// Solidity: event EpochUpdated(uint256 _newLength)
func (_Seqset *SeqsetFilterer) ParseEpochUpdated(log types.Log) (*SeqsetEpochUpdated, error) {
	event := new(SeqsetEpochUpdated)
	if err := _Seqset.contract.UnpackLog(event, "EpochUpdated", log); err != nil {
		return nil, err
	}
	return event, nil
}

// SeqsetInitializedIterator is returned from FilterInitialized and is used to iterate over the raw logs and unpacked data for Initialized events raised by the Seqset contract.
type SeqsetInitializedIterator struct {
	Event *SeqsetInitialized // Event containing the contract specifics and raw log

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
func (it *SeqsetInitializedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SeqsetInitialized)
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
		it.Event = new(SeqsetInitialized)
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
func (it *SeqsetInitializedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SeqsetInitializedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SeqsetInitialized represents a Initialized event raised by the Seqset contract.
type SeqsetInitialized struct {
	Version uint8
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterInitialized is a free log retrieval operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_Seqset *SeqsetFilterer) FilterInitialized(opts *bind.FilterOpts) (*SeqsetInitializedIterator, error) {

	logs, sub, err := _Seqset.contract.FilterLogs(opts, "Initialized")
	if err != nil {
		return nil, err
	}
	return &SeqsetInitializedIterator{contract: _Seqset.contract, event: "Initialized", logs: logs, sub: sub}, nil
}

// WatchInitialized is a free log subscription operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_Seqset *SeqsetFilterer) WatchInitialized(opts *bind.WatchOpts, sink chan<- *SeqsetInitialized) (event.Subscription, error) {

	logs, sub, err := _Seqset.contract.WatchLogs(opts, "Initialized")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SeqsetInitialized)
				if err := _Seqset.contract.UnpackLog(event, "Initialized", log); err != nil {
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

// ParseInitialized is a log parse operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_Seqset *SeqsetFilterer) ParseInitialized(log types.Log) (*SeqsetInitialized, error) {
	event := new(SeqsetInitialized)
	if err := _Seqset.contract.UnpackLog(event, "Initialized", log); err != nil {
		return nil, err
	}
	return event, nil
}

// SeqsetMpcAddressUpdatedIterator is returned from FilterMpcAddressUpdated and is used to iterate over the raw logs and unpacked data for MpcAddressUpdated events raised by the Seqset contract.
type SeqsetMpcAddressUpdatedIterator struct {
	Event *SeqsetMpcAddressUpdated // Event containing the contract specifics and raw log

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
func (it *SeqsetMpcAddressUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SeqsetMpcAddressUpdated)
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
		it.Event = new(SeqsetMpcAddressUpdated)
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
func (it *SeqsetMpcAddressUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SeqsetMpcAddressUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SeqsetMpcAddressUpdated represents a MpcAddressUpdated event raised by the Seqset contract.
type SeqsetMpcAddressUpdated struct {
	NewMpcAddress common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterMpcAddressUpdated is a free log retrieval operation binding the contract event 0x9416d5b743f4c1409b0213ee5d1e57e8515f4be68a32fbbda85f838891b421da.
//
// Solidity: event MpcAddressUpdated(address _newMpcAddress)
func (_Seqset *SeqsetFilterer) FilterMpcAddressUpdated(opts *bind.FilterOpts) (*SeqsetMpcAddressUpdatedIterator, error) {

	logs, sub, err := _Seqset.contract.FilterLogs(opts, "MpcAddressUpdated")
	if err != nil {
		return nil, err
	}
	return &SeqsetMpcAddressUpdatedIterator{contract: _Seqset.contract, event: "MpcAddressUpdated", logs: logs, sub: sub}, nil
}

// WatchMpcAddressUpdated is a free log subscription operation binding the contract event 0x9416d5b743f4c1409b0213ee5d1e57e8515f4be68a32fbbda85f838891b421da.
//
// Solidity: event MpcAddressUpdated(address _newMpcAddress)
func (_Seqset *SeqsetFilterer) WatchMpcAddressUpdated(opts *bind.WatchOpts, sink chan<- *SeqsetMpcAddressUpdated) (event.Subscription, error) {

	logs, sub, err := _Seqset.contract.WatchLogs(opts, "MpcAddressUpdated")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SeqsetMpcAddressUpdated)
				if err := _Seqset.contract.UnpackLog(event, "MpcAddressUpdated", log); err != nil {
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

// ParseMpcAddressUpdated is a log parse operation binding the contract event 0x9416d5b743f4c1409b0213ee5d1e57e8515f4be68a32fbbda85f838891b421da.
//
// Solidity: event MpcAddressUpdated(address _newMpcAddress)
func (_Seqset *SeqsetFilterer) ParseMpcAddressUpdated(log types.Log) (*SeqsetMpcAddressUpdated, error) {
	event := new(SeqsetMpcAddressUpdated)
	if err := _Seqset.contract.UnpackLog(event, "MpcAddressUpdated", log); err != nil {
		return nil, err
	}
	return event, nil
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
	EpochId    *big.Int
	StartBlock *big.Int
	EndBlock   *big.Int
	Signer     common.Address
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterNewEpoch is a free log retrieval operation binding the contract event 0x9030849b7c46dbbea7911d67c5814a2ab19c0704c448defc9b87589447844cc6.
//
// Solidity: event NewEpoch(uint256 indexed epochId, uint256 startBlock, uint256 endBlock, address signer)
func (_Seqset *SeqsetFilterer) FilterNewEpoch(opts *bind.FilterOpts, epochId []*big.Int) (*SeqsetNewEpochIterator, error) {

	var epochIdRule []interface{}
	for _, epochIdItem := range epochId {
		epochIdRule = append(epochIdRule, epochIdItem)
	}

	logs, sub, err := _Seqset.contract.FilterLogs(opts, "NewEpoch", epochIdRule)
	if err != nil {
		return nil, err
	}
	return &SeqsetNewEpochIterator{contract: _Seqset.contract, event: "NewEpoch", logs: logs, sub: sub}, nil
}

// WatchNewEpoch is a free log subscription operation binding the contract event 0x9030849b7c46dbbea7911d67c5814a2ab19c0704c448defc9b87589447844cc6.
//
// Solidity: event NewEpoch(uint256 indexed epochId, uint256 startBlock, uint256 endBlock, address signer)
func (_Seqset *SeqsetFilterer) WatchNewEpoch(opts *bind.WatchOpts, sink chan<- *SeqsetNewEpoch, epochId []*big.Int) (event.Subscription, error) {

	var epochIdRule []interface{}
	for _, epochIdItem := range epochId {
		epochIdRule = append(epochIdRule, epochIdItem)
	}

	logs, sub, err := _Seqset.contract.WatchLogs(opts, "NewEpoch", epochIdRule)
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

// ParseNewEpoch is a log parse operation binding the contract event 0x9030849b7c46dbbea7911d67c5814a2ab19c0704c448defc9b87589447844cc6.
//
// Solidity: event NewEpoch(uint256 indexed epochId, uint256 startBlock, uint256 endBlock, address signer)
func (_Seqset *SeqsetFilterer) ParseNewEpoch(log types.Log) (*SeqsetNewEpoch, error) {
	event := new(SeqsetNewEpoch)
	if err := _Seqset.contract.UnpackLog(event, "NewEpoch", log); err != nil {
		return nil, err
	}
	return event, nil
}

// SeqsetOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the Seqset contract.
type SeqsetOwnershipTransferredIterator struct {
	Event *SeqsetOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *SeqsetOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SeqsetOwnershipTransferred)
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
		it.Event = new(SeqsetOwnershipTransferred)
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
func (it *SeqsetOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SeqsetOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SeqsetOwnershipTransferred represents a OwnershipTransferred event raised by the Seqset contract.
type SeqsetOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Seqset *SeqsetFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*SeqsetOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Seqset.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &SeqsetOwnershipTransferredIterator{contract: _Seqset.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Seqset *SeqsetFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *SeqsetOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Seqset.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SeqsetOwnershipTransferred)
				if err := _Seqset.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Seqset *SeqsetFilterer) ParseOwnershipTransferred(log types.Log) (*SeqsetOwnershipTransferred, error) {
	event := new(SeqsetOwnershipTransferred)
	if err := _Seqset.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
	OldEpochId *big.Int
	NewEpochId *big.Int
	StartBlock *big.Int
	EndBlock   *big.Int
	NewSigner  common.Address
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterReCommitEpoch is a free log retrieval operation binding the contract event 0x2555d8fe1de86f68f4f9918cdd7c647eaebcc50009b03367c7cf4676a929c070.
//
// Solidity: event ReCommitEpoch(uint256 indexed oldEpochId, uint256 indexed newEpochId, uint256 startBlock, uint256 endBlock, address newSigner)
func (_Seqset *SeqsetFilterer) FilterReCommitEpoch(opts *bind.FilterOpts, oldEpochId []*big.Int, newEpochId []*big.Int) (*SeqsetReCommitEpochIterator, error) {

	var oldEpochIdRule []interface{}
	for _, oldEpochIdItem := range oldEpochId {
		oldEpochIdRule = append(oldEpochIdRule, oldEpochIdItem)
	}
	var newEpochIdRule []interface{}
	for _, newEpochIdItem := range newEpochId {
		newEpochIdRule = append(newEpochIdRule, newEpochIdItem)
	}

	logs, sub, err := _Seqset.contract.FilterLogs(opts, "ReCommitEpoch", oldEpochIdRule, newEpochIdRule)
	if err != nil {
		return nil, err
	}
	return &SeqsetReCommitEpochIterator{contract: _Seqset.contract, event: "ReCommitEpoch", logs: logs, sub: sub}, nil
}

// WatchReCommitEpoch is a free log subscription operation binding the contract event 0x2555d8fe1de86f68f4f9918cdd7c647eaebcc50009b03367c7cf4676a929c070.
//
// Solidity: event ReCommitEpoch(uint256 indexed oldEpochId, uint256 indexed newEpochId, uint256 startBlock, uint256 endBlock, address newSigner)
func (_Seqset *SeqsetFilterer) WatchReCommitEpoch(opts *bind.WatchOpts, sink chan<- *SeqsetReCommitEpoch, oldEpochId []*big.Int, newEpochId []*big.Int) (event.Subscription, error) {

	var oldEpochIdRule []interface{}
	for _, oldEpochIdItem := range oldEpochId {
		oldEpochIdRule = append(oldEpochIdRule, oldEpochIdItem)
	}
	var newEpochIdRule []interface{}
	for _, newEpochIdItem := range newEpochId {
		newEpochIdRule = append(newEpochIdRule, newEpochIdItem)
	}

	logs, sub, err := _Seqset.contract.WatchLogs(opts, "ReCommitEpoch", oldEpochIdRule, newEpochIdRule)
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

// ParseReCommitEpoch is a log parse operation binding the contract event 0x2555d8fe1de86f68f4f9918cdd7c647eaebcc50009b03367c7cf4676a929c070.
//
// Solidity: event ReCommitEpoch(uint256 indexed oldEpochId, uint256 indexed newEpochId, uint256 startBlock, uint256 endBlock, address newSigner)
func (_Seqset *SeqsetFilterer) ParseReCommitEpoch(log types.Log) (*SeqsetReCommitEpoch, error) {
	event := new(SeqsetReCommitEpoch)
	if err := _Seqset.contract.UnpackLog(event, "ReCommitEpoch", log); err != nil {
		return nil, err
	}
	return event, nil
}
