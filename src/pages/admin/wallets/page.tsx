"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import {
    Plus,
    Shield,
    Trash2,
    Loader2,
    Save
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Switch, Table, Tag, Space, Modal, Form } from "antd"
import { RootState } from '@/modules/rootReducer'
import { fetchWalletsRequest, saveWalletRequest, deleteWalletRequest } from '@/modules/admin/wallets/actions'
import type { AdminWallet } from '@/modules/admin/wallets/reducer'

export default function AdminWallets() {
    const dispatch = useDispatch()
    const { wallets, loading, saving } = useSelector(
        (state: RootState) => state.adminWallets,
    )
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingWallet, setEditingWallet] = useState<AdminWallet | null>(null)
    const [form] = Form.useForm()

    useEffect(() => {
        dispatch(fetchWalletsRequest())
    }, [dispatch])

    const handleSave = async (values: any) => {
        dispatch(saveWalletRequest(
            editingWallet ? { id: editingWallet._id, ...values } : values,
        ))
        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Master Wallet?',
            content: 'This will remove this wallet from receiving bot withdrawals.',
            okText: 'Delete',
            okType: 'danger',
            async onOk() {
                dispatch(deleteWalletRequest(id))
            }
        })
    }

    const columns = [
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
            render: (text: string) => <span className="font-bold text-sm">{text}</span>
        },
        {
            title: 'Network',
            dataIndex: 'network',
            key: 'network',
            render: (text: string) => <Tag className="uppercase text-[10px]">{text}</Tag>
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text: string) => <Tag color="blue" className="uppercase text-[10px]">{text}</Tag>
        },
        {
            title: 'Master Address',
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => (
                <code className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded select-all truncate max-w-[200px] block">
                    {text}
                </code>
            )
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (active: boolean) => (
                <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AdminWallet) => (
                <Space>
                    <Button variant="ghost" size="sm" onClick={() => {
                        setEditingWallet(record)
                        form.setFieldsValue(record)
                        setIsModalOpen(true)
                    }}>
                        Edit
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(record._id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" />
                        Master Admin Wallets
                    </h1>
                    <p className="text-muted-foreground mt-1">Set receiving addresses for the Withdrawal Bot.</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingWallet(null)
                        form.resetFields()
                        setIsModalOpen(true)
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl h-12 px-6"
                >
                    <Plus className="w-4 h-4" />
                    Add Master Wallet
                </Button>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Master Receiving Addresses</CardTitle>
                    <CardDescription>The bot will sweep user deposits to these addresses based on network match.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table
                        dataSource={wallets}
                        columns={columns}
                        rowKey="_id"
                        loading={loading}
                        pagination={false}
                    />
                </CardContent>
            </Card>

            <Modal
                title={editingWallet ? "Edit Master Wallet" : "Add New Master Wallet"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
            >
                <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
                    <Form.Item name="label" label="Wallet Label (e.g., Main Binance Wallet)" rules={[{ required: true }]}>
                        <Input placeholder="Main Payout Wallet" />
                    </Form.Item>
                    <Form.Item name="network" label="Network ID (e.g., bsc, eth, tron)" rules={[{ required: true }]}>
                        <Input placeholder="bsc" />
                    </Form.Item>
                    <Form.Item name="symbol" label="Native Token Symbol (e.g., BNB, ETH, TRX)" rules={[{ required: true }]}>
                        <Input placeholder="BNB" />
                    </Form.Item>
                    <Form.Item name="address" label="Receiving Address" rules={[{ required: true }]}>
                        <Input placeholder="0x..." />
                    </Form.Item>
                    <Form.Item name="isActive" label="Is Active" valuePropName="checked">
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Wallet
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
