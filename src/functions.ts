import { calculateAchievements, calculateProductions, calculateProductionsPerResource } from "./system/updateFunctions"
import { walls } from "./data/walls"
import { setLastUpdate } from "./redux/appSlice"
import { AppDispatch, store } from "./redux/store"
import { addAchievements, createSystemObject, decreaseResource, increaseResource } from "./redux/systemSlice"
import { increaseWall } from "./redux/systemAdditionsSlice"
import { createObjectFromKeys, objectKeys } from "./util"
//@ts-ignore
import * as swarmNumberformat from "swarm-numberformat"
import { producers } from "./data/producers"
import { resources } from "./data/resources"

export const update = (dispatch: AppDispatch) => {
    const state = store.getState()
    //Calculate passed time
    const currentTime = new Date().getTime()
    const oldTime = state.appReducer.lastUpdate
    const deltaTime = currentTime - oldTime
    dispatch(setLastUpdate(currentTime))

    const productionsFull = calculateProductions(createSystemObject(state.systemReducer), deltaTime)
    const productions = calculateProductionsPerResource(createSystemObject(state.systemReducer), productionsFull)

    dispatch(increaseResource(["damage", productions.damage]))
    dispatch(increaseResource(["money", productions.money]))
    dispatch(increaseResource(["bricks", productions.bricks]))

    const newAchievements = calculateAchievements(createSystemObject(state.systemReducer))
    dispatch(addAchievements(newAchievements))
}

export const destroyWall = (dispatch: AppDispatch) => {
    const state = store.getState()
    const wallNum = state.systemAdditionsReducer.wall
    const damage = state.systemReducer.resources.damage

    const wall = walls[wallNum]

    if(damage <= wall.requirement) {
        return;
    }
    dispatch(decreaseResource(["damage", wall.requirement]))

    objectKeys(wall.reward)
        .forEach(reward => dispatch(increaseResource([reward, wall.reward[reward]])))

    dispatch(increaseWall())
}

export const calculateBuildingCost = (producer: keyof typeof producers) => {
    const state = store.getState()
    const producerAmount = state.systemReducer.producers[producer]

    return createObjectFromKeys(resources, r => producers[producer].cost[r]*Math.pow(producers[producer].costScaling, producerAmount))
}

export const prettify = (num: number): string => {
    if (num <= 100) {
        return (Math.round(num * 1000) / 1000).toString();
    }
    const format = store.getState().appReducer.format
    return swarmNumberformat.numberformat.format(num, {format, sigfigs: 4, flavor: "short"});
}