import React, { ForwardedRef, forwardRef } from "react";
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import { grey } from '@mui/material/colors';

export const sideBarHeadStyle = {
    fontSize:'0.9rem',
    fontWeight:'bold',
    color:grey[500],
    verticalAlign:'bottom',
}

const ItemWrapper = forwardRef((
    {
        title,
        children
    }:{
        title:string;
        children:JSX.Element;
    },
    ref:ForwardedRef<HTMLDivElement>
) => {
    return (
        <Paper ref={ref}>
            <Table>
                <TableBody>
                    <TableRow
                        sx={{
                            '.MuiTableCell-root':{
                                p:0,
                                border:'none',
                                '&:not(:last-of-type)':{
                                    py:1
                                }
                            }
                        }}
                    >
                        {/*<TableCell sx={{width:0,cursor:'move'}}>
                            <Box sx={{display:'flex',justifyContent:'center'}}>
                                <DragIndicatorIcon fontSize="small" sx={{mx:1}} htmlColor={grey[500]} />
                            </Box>
                        </TableCell>*/}
                        <TableCell>
                            <Typography sx={{...sideBarHeadStyle,ml:2}}>{title}</Typography>
                        </TableCell>
                        {/*<TableCell sx={{width:0}}>
                            <IconButton>
                                <MoreVertIcon fontSize="small" htmlColor={grey[500]} />
                            </IconButton>
                    </TableCell>*/}
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={1} sx={{p:0,border:'none'}}>{children}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    )
})
ItemWrapper.displayName = 'ItemWrapper'
export default ItemWrapper