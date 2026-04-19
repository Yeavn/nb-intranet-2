import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

type User = { full_name: string; [key: string]: any };
type Props = {
    group: String,
    data: User[]
}

export default function PhotoTable({group, data}: Props) {
    return(
        <div className="mt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[75%]"><p className="font-bold">{group}</p></TableHead>
                        <TableHead className="w-[25%]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((user, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.photos ? <FaCheck /> : <RxCross1 />}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}