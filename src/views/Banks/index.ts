import * as vfatcore from '../../vfat/core'
import * as contracts from '../../vfat/contracts'

export { default } from './Banks'


const job = async () => {

    const vfat = await vfatcore.init()

    const pools = [
        'MAHAMAHAETHLPTokenPool',
        'MAHADAIARTHLPTokenPool',
        'MAHAARTHPool',
        'MAHADAIARTHMLPTokenPool',
    ]

    const result: any = {}

    for (let index = 0; index < pools.length; index++) {
        result[pools[index]] = await vfat.getAPYFromPool(pools[index]);
        console.log(pools[index], result[pools[index]])
    }


    console.log(JSON.stringify(result))
}

// job()