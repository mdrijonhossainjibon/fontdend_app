"use client"

import { useEffect, useState } from "react"
import {
    Plus,
    Settings2,
    Zap,
    Globe,
    Save,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Trash2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Switch, Select, Modal, Form, message, Tag, Space, Table, Divider, Button as AntButton, Tooltip } from "antd"
import { API_CALL } from "@/lib/auth-fingerprint"
import { CryptoIcon } from "@/components/CryptoIcon"
interface Network {
    id: string
    name: string
    fee: string
    time: string
    confirmations: number
    minDeposit: string
    address: string
    badge?: string
    badgeColor?: string
    isActive: boolean
}

interface CryptoConfig {
    id: string
    name: string
    fullName: string
    icon: string
    color: string
    bg: string
    borderGlow: string
    networks: Network[]
    isActive: boolean
}

export default function AdminCrypto() {
    const [configs, setConfigs] = useState<CryptoConfig[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState<CryptoConfig | null>(null)
    const [form] = Form.useForm()

    // Add Ant Design Hooks
    const [modal, modalContextHolder] = Modal.useModal()
    const [messageApi, messageContextHolder] = message.useMessage()

    const fetchConfigs = async () => {
        setLoading(true)
        try {
            const { response, status } = await API_CALL({ method: 'GET', url: '/crypto/config' })
            if (status === 200 && response.success) {
                setConfigs(response.data)
            } else {
                messageApi.error(response?.error || "Failed to fetch configurations")
            }
        } catch (error) {
            messageApi.error("Failed to fetch configurations")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConfigs()
    }, [])

    const handleEdit = (config: CryptoConfig) => {
        setEditingConfig(config)
        form.setFieldsValue(config)
        setIsModalOpen(true)
    }

    const handleAddNew = () => {
        setEditingConfig(null)
        form.resetFields()
        form.setFieldsValue({
            isActive: true,
            networks: []
        })
        setIsModalOpen(true)
    }

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            // Ensure confirmations is a number for each network
            const formattedValues = {
                ...values,
                networks: values.networks?.map((net: any) => ({
                    ...net,
                    confirmations: Number(net.confirmations)
                })) || []
            }

            const { response, status } = await API_CALL({ method: 'POST', url: '/crypto/config', body: formattedValues })
            if (status === 200 && response.success) {
                messageApi.success(response.message)
                setIsModalOpen(false)
                fetchConfigs()
            } else {
                messageApi.error(response?.error || "Save failed")
            }
        } catch (error) {
            messageApi.error("Failed to save configuration")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id: string) => {
        modal.confirm({
            title: 'Delete Cryptocurrency?',
            icon: <AlertCircle className="text-destructive w-5 h-5 mr-2" />,
            content: 'This will permanently remove this cryptocurrency and all its network configurations. This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            async onOk() {
                try {
                    const { response, status } = await API_CALL({ method: 'DELETE', url: `/crypto/config?id=${id}` })
                    if (status === 200 && response.success) {
                        messageApi.success("Crypto configuration deleted")
                        fetchConfigs()
                    } else {
                        messageApi.error(response?.error || "Delete failed")
                    }
                } catch (error) {
                    messageApi.error("Failed to delete configuration")
                }
            }
        })
    }

    const columns = [
        {
            title: 'Coin',
            key: 'coin',
            render: (_: any, record: CryptoConfig) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden">
                        <CryptoIcon coinId={record.id} className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">{record.name}</p>
                        <p className="text-xs text-muted-foreground">{record.fullName}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Networks',
            key: 'networks',
            render: (_: any, record: CryptoConfig) => (
                <div className="flex flex-wrap gap-1">
                    {record.networks.map(n => (
                        <Tag key={n.id} color={n.isActive ? 'blue' : 'default'} className="text-[10px]">
                            {n.name}
                        </Tag>
                    ))}
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: CryptoConfig) => (
                <Space onClick={(e) => e.stopPropagation()}>
                    <AntButton
                        type="text"
                        size="small"
                        onClick={() => handleEdit(record)}
                        icon={<Settings2 className="w-4 h-4" />}
                    >
                        Edit
                    </AntButton>
                    <Tooltip title="Delete Asset">
                        <AntButton
                            type="text"
                            danger
                            size="small"
                            onClick={() => handleDelete(record.id)}
                            icon={<Trash2 className="w-4 h-4" />}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {modalContextHolder}
            {messageContextHolder}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Zap className="w-8 h-8 text-yellow-500" />
                        Crypto Configuration
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage supported cryptocurrencies and their networks.</p>
                </div>
                <AntButton
                    type="primary"
                    size="large"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => {
                        setEditingConfig(null)
                        form.resetFields()
                        setIsModalOpen(true)
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 border-none text-black font-bold h-12 rounded-xl"
                >
                    Add New Crypto
                </AntButton>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Active Cryptocurrencies</CardTitle>
                    <CardDescription>System-wide crypto assets available for user transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table
                        dataSource={configs}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                        className="admin-crypto-table"
                    />
                </CardContent>
            </Card>

            <Modal
                title={editingConfig ? `Edit ${editingConfig.name}` : "Add New Crypto"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ isActive: true }}
                    className="mt-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="id" label="Coin ID (e.g., usdt, btc)" rules={[{ required: true }]}>
                            <Input placeholder="usdt" disabled={!!editingConfig} />
                        </Form.Item>
                        <Form.Item name="name" label="Short Name (e.g., USDT)" rules={[{ required: true }]}>
                            <Input placeholder="USDT" />
                        </Form.Item>
                        <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                            <Input placeholder="Tether USD" />
                        </Form.Item>
                        <Form.Item name="icon" label="Icon Name" rules={[{ required: true }]}>
                            <Input placeholder="usdt" />
                        </Form.Item>
                        <Form.Item name="color" label="Brand Color (text-xxx)" rules={[{ required: true }]}>
                            <Input placeholder="text-green-500" />
                        </Form.Item>
                        <Form.Item name="bg" label="Background CSS (bg-xxx)" rules={[{ required: true }]}>
                            <Input placeholder="bg-green-500/10" />
                        </Form.Item>
                        <Form.Item name="borderGlow" label="Border Glow CSS (shadow-xxx)" rules={[{ required: true }]}>
                            <Input placeholder="shadow-green-500/20" />
                        </Form.Item>
                        <Form.Item name="isActive" label="Is Active" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>

                    <Divider>Networks</Divider>

                    <Form.List name="networks">
                        {(fields, { add, remove }) => (
                            <div className="space-y-4">
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="p-4 border rounded-xl bg-secondary/20 relative group">
                                        <AntButton
                                            type="text"
                                            danger
                                            size="small"
                                            className="absolute top-2 right-2"
                                            onClick={() => remove(name)}
                                            icon={<Trash2 className="w-4 h-4" />}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <Form.Item {...restField} name={[name, 'id']} label="Net ID" rules={[{ required: true }]}>
                                                <Input placeholder="bsc" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'name']} label="Net Name" rules={[{ required: true }]}>
                                                <Input placeholder="BNB Smart Chain" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'address']} label="Default Address" rules={[{ required: true }]}>
                                                <Input placeholder="0x..." />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'time']} label="Processing Time" rules={[{ required: true }]}>
                                                <Input placeholder="5-10 mins" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'confirmations']} label="Confirmations" rules={[{ required: true }]}>
                                                <Input type="number" placeholder="1" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'fee']} label="Service Fee" rules={[{ required: true }]}>
                                                <Input placeholder="1 USDT" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'minDeposit']} label="Min Deposit" rules={[{ required: true }]}>
                                                <Input placeholder="10 USDT" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'isActive']} label="Active" valuePropName="checked">
                                                <Switch size="small" />
                                            </Form.Item>
                                        </div>
                                    </div>
                                ))}
                                <AntButton type="dashed" onClick={() => add()} block icon={<Plus className="w-4 h-4" />}>
                                    Add Network
                                </AntButton>
                            </div>
                        )}
                    </Form.List>

                    <Form.Item className="mt-8 mb-0 flex justify-end">
                        <Space>
                            <AntButton onClick={() => setIsModalOpen(false)}>Cancel</AntButton>
                            <AntButton
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="bg-yellow-500 hover:bg-yellow-600 border-none text-black font-bold h-10 px-6"
                            >
                                Save Configuration
                            </AntButton>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
