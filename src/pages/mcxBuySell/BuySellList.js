import React from 'react'
import { McxRateProvider } from '../../contexts/MxcRateContext'
import BuySellListTable from './BuySellListTable'

const BuySellList = () => {
    return (
        <McxRateProvider>
            <BuySellListTable />
        </McxRateProvider>
    )
}

export default BuySellList