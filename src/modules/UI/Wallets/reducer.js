// @flow

import { combineReducers } from 'redux'
import { ABCDenomination, ABCMetaToken, GUIWallet } from '../../../types.js'
import * as ACTION from './action'

export const byId = (state:any = {}, action:any) => {
  const { type, data = {} } = action
  switch (type) {
    case ACTION.UPSERT_WALLET:
      return {
        ...state,
        [data.wallet.id]: schema(data.wallet)
      }

    case ACTION.DELETE_WALLET: {
      const { walletId } = data
      const newState = Object.assign({}, state)
      delete newState[walletId]
      return newState
    }

    default:
      return state
  }
}

export const activeWalletIds = (state:any = [], action:any) => {
  const { type, data = {} } = action
  const { wallet } = data
  switch (type) {
    case ACTION.UPSERT_WALLET:
      if (!wallet.archived) {
        return getNewArrayWithItem(state, wallet.id)
      }
      return getNewArrayWithoutItem(state, wallet.id)
    default:
      return state
  }
}

export const archivedWalletIds = (state:any = [], action:any) => {
  const { type, data = {} } = action
  const { wallet } = data
  switch (type) {
    case ACTION.UPSERT_WALLET:
      if (!wallet.archived || wallet.deleted) {
        return getNewArrayWithoutItem(state, wallet.id)
      }
      return getNewArrayWithItem(state, wallet.id)
    default:
      return state
  }
}

export const selectedWalletId = (state:string = '', action:any) => {
  const { type, data = {} } = action
  const { walletId } = data

  switch (type) {
    case ACTION.SELECT_WALLET_ID:
      return walletId
    default:
      return state
  }
}

export const selectedCurrencyCode = (state:string = '', action:any) => {
  const { type, data = {} } = action
  const { currencyCode } = data

  switch (type) {
    case ACTION.SELECT_CURRENCY_CODE:
      return currencyCode
    default:
      return state
  }
}

function schema (wallet:any):GUIWallet {
  const id:string = wallet.id
  const type:string = wallet.type
  const name:string = wallet.name || 'no wallet name'
  const sortIndex:number = wallet.sortIndex
  const archived:boolean = wallet.archived
  const deleted:boolean = wallet.deleted

  const currencyCode:string = wallet.currencyInfo.currencyCode
  const fiatCurrencyCode:string = wallet.fiatCurrencyCode.replace('iso:', '')
  const isoFiatCurrencyCode:string = wallet.fiatCurrencyCode
  const symbolImage:string = wallet.currencyInfo.symbolImage
  const metaTokens:Array<ABCMetaToken> = wallet.currencyInfo.metaTokens
  const denominations:Array<ABCDenomination> = wallet.currencyInfo.denominations

  let allDenominations: { [currencyCode: string]: { [denomination: string]: ABCDenomination } } = {}

  // allDenominations[currencyCode] = {}
  // Add all parent wallet denominations to allDenominations
  denominations.forEach(denomination => {
    let denomIndex:{[denomination: string]: ABCDenomination} = {}
    denomIndex[denomination.multiplier] = denomination
    allDenominations[currencyCode] = denomIndex
  })

  const nativeBalances: { [currencyCode: string]: string} = {}
  // Add parent wallet balance to balances
  nativeBalances[currencyCode] = wallet.getBalance({ currencyCode })
  const currencyNames: { [currencyCode: string]: string} = {}
  currencyNames[currencyCode] = wallet.currencyInfo.currencyName

  metaTokens.forEach(metaToken => {
    const currencyCode:string = metaToken.currencyCode
    const currencyName:string = metaToken.currencyName
    const tokenBalance:string = wallet.getBalance({ currencyCode })
    const tokenDenominations:Array<ABCDenomination> = metaToken.denominations

    // Add token balance to allBalances
    nativeBalances[currencyCode] = tokenBalance
    currencyNames[currencyCode] = currencyName

    // Add all token denominations to allDenominations
    // allDenominations[currencyCode] = {}
    tokenDenominations.forEach(denomination => {
      let denomIndex:{[denomination: string]: ABCDenomination} = {}
      denomIndex[denomination.multiplier] = denomination
      allDenominations[currencyCode] = denomIndex
    })
  })

  const primaryNativeBalance:string = nativeBalances[currencyCode]

  const newWallet = new GUIWallet(
    id,
    type,
    name,
    primaryNativeBalance,
    nativeBalances,
    currencyNames,
    currencyCode,
    isoFiatCurrencyCode,
    fiatCurrencyCode,
    denominations,
    allDenominations,
    symbolImage,
    metaTokens,
    sortIndex,
    archived,
    deleted
  )

  return newWallet
}

const getNewArrayWithoutItem = (list, targetItem) => {
  return list.filter(item => {
    return item !== targetItem
  })
}

const getNewArrayWithItem = (list, item) => {
  if (!list.includes(item)) {
    return [...list, item]
  }
  return list
}

export const wallets = combineReducers({
  byId,
  activeWalletIds,
  archivedWalletIds,
  selectedWalletId,
  selectedCurrencyCode
})
