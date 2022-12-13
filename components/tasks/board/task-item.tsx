import { interpolateColorString, updateSession } from "@components/functions";
import { useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Typography from "@mui/material/Typography";
import { ReduxState, useAppDispatch, useAppSelector } from "@reducers";
import { updateRouterHistory } from "@reducers/misc";
import { createSelector, EntityId } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import React, { memo, useContext, useMemo } from "react";
import { BoardViewDispatchContext } from ".";
import { Task } from "../interfaces";
import { taskSelector } from "../reducers/slice";
import { drop, moving, taskStartMoving } from "./reducer";
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { userDetailsSelector } from "@reducers/user-details/slice";
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

const 
    avatarSize = 30,
    leftIconSize = 18,
    IsGroupTask = memo((
        {
            ownerID,
            assigneeID,
        }:{
            ownerID:EntityId;
            assigneeID:EntityId;
        }
    )=>{
        const
            owner = useAppSelector(state => userDetailsSelector.selectById(state,ownerID)),
            assignee = useAppSelector(state => userDetailsSelector.selectById(state,assigneeID))

        return (
            <Stack direction='row' spacing={1} mt={0.5}>
                <PeopleAltRoundedIcon sx={{width:leftIconSize,height:leftIconSize}} />
                <Stack direction='row' spacing={0.2}>
                    <Tooltip title={`Task owner: ${owner.firstName} ${owner.lastName}`}>
                        <Avatar src={owner.avatar} sx={{width:avatarSize,height:avatarSize}} />
                    </Tooltip>
                    <ArrowRightAltRoundedIcon sx={{width:avatarSize,height:avatarSize}} />
                    <Tooltip title={`Task assignee: ${assignee.firstName} ${assignee.lastName}`}>
                        <Avatar src={assignee.avatar} sx={{width:avatarSize,height:avatarSize}} />
                    </Tooltip>
                </Stack>
            </Stack>
        )
    }),
    IsNotGroupTask = memo(({ownerID}:{ownerID:EntityId;})=>{
        const owner = useAppSelector(state => userDetailsSelector.selectById(state,ownerID))
        return (
            <Stack direction='row' spacing={1} mt={0.5}>
                <PersonRoundedIcon sx={{width:leftIconSize,height:leftIconSize}} />
                <Tooltip title={`Task owner: ${owner.firstName} ${owner.lastName}`}>
                    <Avatar src={owner.avatar} sx={{width:avatarSize,height:avatarSize}} />
                </Tooltip>
            </Stack>
        )
    }),
    TaskItem = memo((
        {
            taskID,
            columnIdx,
            taskIdx,
        }:{
            taskID:EntityId;
            columnIdx:number;
            taskIdx:number;
        }
    )=>{
        const
            {palette:{primary,error}} = useTheme(),
            statusColorSelector = useMemo(()=>createSelector(
                (state:ReduxState)=>taskSelector.selectById(state,taskID),
                (t:Task)=>{
                    if (!t) return 'transparent'
                    return interpolateColorString(error.main,primary.main,+t.approval)
                }
            ),[taskID]),
            statusColor = useAppSelector(state => statusColorSelector(state)),
            taskName = useAppSelector(state => taskSelector.selectById(state,taskID)?.name || ''),
            deadline = useAppSelector(state => taskSelector.selectById(state,taskID)?.deadlineDT || 0),
            isGroupTask = useAppSelector(state => taskSelector.selectById(state,taskID)?.isGroupTask || false),
            task = useAppSelector(state => taskSelector.selectById(state,taskID)),
            {boardViewDispatch} = useContext(BoardViewDispatchContext),
            onDragStart = () => boardViewDispatch(taskStartMoving(taskID)),
            onDragEnter = () => boardViewDispatch(moving({columnIdx,taskIdx})),
            onDrop = () => boardViewDispatch(drop),
            router = useRouter(),
            dispatch = useAppDispatch(),
            onClick = () => {
                updateSession(router,dispatch)
                dispatch(updateRouterHistory({
                    asPath:router.asPath,
                    queryString:JSON.stringify(router.query)
                }))
                router.push({query:{page:'tasks',taskid:taskID}},`/tasks/t/${taskID}`,{shallow:true})
            }

        return (
            <Paper 
                elevation={3}
                draggable
                onDragStart={onDragStart}
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                onDragEnd={onDrop}
                square
                sx={{
                    p:1,
                    cursor:'pointer',
                    borderLeft:`5px solid ${statusColor}`,
                }}
                data-taskid={taskID}
                onClick={onClick}
            >
                <Typography sx={{fontWeight:'bold',mb:1}}>{taskName}</Typography>
                {deadline!==0 && <Stack direction='row' spacing={1} my={1}>
                    <CalendarMonthRoundedIcon sx={{width:leftIconSize,height:leftIconSize}} />
                    <Typography sx={{fontSize:'0.8rem'}}>{new Date(deadline).toLocaleDateString('en-UK',{month:'short',day:'numeric'})}</Typography>
                </Stack>}
                {!isGroupTask && !!task?.owner && <IsNotGroupTask ownerID={task.owner} />}
                {isGroupTask && !!task?.owner && !!task.assignee && <IsGroupTask ownerID={task.owner} assigneeID={task.assignee} />}
            </Paper>
        )
    })

TaskItem.displayName = 'TaskItem'
IsGroupTask.displayName = 'IsGroupTask'
IsNotGroupTask.displayName = 'IsNotGroupTask'
export default TaskItem