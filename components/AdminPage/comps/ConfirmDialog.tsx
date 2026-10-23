"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

type Props = {
    trigger: React.ReactElement;
    title: string;
    description: string;
    confirmLabel: string;
    destructive?: boolean;
    onConfirm: () => Promise<void>;
}

export default function ConfirmDialog({ trigger, title, description, confirmLabel, destructive, onConfirm }: Props) {
    const [open, setOpen] = useState(false)
    const [busy, setBusy] = useState(false)

    async function handleConfirm() {
        setBusy(true)
        await onConfirm()
        setBusy(false)
        setOpen(false)
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={trigger} />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline">Abbrechen</Button>} />
                    <Button variant={destructive ? "destructive" : "default"} disabled={busy} onClick={handleConfirm}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
