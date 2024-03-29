import { Box, Divider, Grid, Typography } from "@mui/material"
import { FC } from "react"
import { Pane } from "../util/Pane"
import { keyframes } from "@emotion/react";
import { walls } from "../../data/walls"
import { destroyWall } from "../../functions"
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ResourceCard } from "../util/ResourceCard";
import { objectKeys } from "../../util";

export const Wall: FC = () => {
    const wall = useAppSelector(s => s.systemAdditionsReducer.wall)

    return (
        <div style={{alignItems: "center", display: "flex", flexDirection: "column"}}>
            <WallImage/>

            <Pane style={{padding: "5px"}}>
                The {walls[wall].name}
                <br/>
                <i>{walls[wall].description}</i>
                <br/>
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography>
                        Rewards:
                    </Typography>
                    <Typography sx={{marginRight: "30px"}}>
                        Health:
                    </Typography>
                </Box>
                <Divider style={{marginBottom: "5px"}}/>
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <RewardsGrid wall={wall}/>
                    <ResourceCard name="damage" amount={walls[wall].requirement}/>
                </Box>
                Unlocks:
                <Divider style={{marginBottom: "5px"}}/>
                {walls[wall].unlocks
                    .map((src) => <img alt="" key={src} style={{filter:"grayscale(100%)", margin: "2px", width: "50px", height: "50px"}} src={src}/>)}
            </Pane>
        </div>
    )
}

const WallImage: FC = () => {
    const damage = useAppSelector(s => s.systemReducer.resources.damage)
    const wallNum = useAppSelector(s => s.systemAdditionsReducer.wall)
    const dispatch = useAppDispatch()

    const wall = walls[wallNum]

    const glow = keyframes`
        0% {box-shadow: 0 0 1px 1px #58c4b1}
        40% {box-shadow: 0 0 20px 10px #A2CFC4}
        100% {box-shadow: 0 0 1px 1px #58c4b1}
    `

    return damage <= wall.requirement ? 
        <Box component="img" src={wall.img} sx={{
            width: "70vw", 
            backgroundColor: "#a2cfc4",
            marginBottom: "10px",
            cursor: "not-allowed"
        }}/> : 
        <Box component="img" src={wall.img} onClick={() => destroyWall(dispatch)} sx={{
            width: "70vw", 
            backgroundColor: "#a2cfc4",
            animation: `${glow} 3.5s infinite`,
            marginBottom: "10px",
            cursor: "pointer",
        }}/>
}


const RewardsGrid: FC<{wall: number}> = ({wall}) => {
    const rewards = walls[wall].reward

    return (
        <Box sx={{display: "flex"}}>
            {objectKeys(rewards)
                .filter(name => rewards[name] !== 0)
                .map(name => <ResourceCard key={name} name={name} amount={rewards[name]}/>)}
        </Box>
    ) 
}