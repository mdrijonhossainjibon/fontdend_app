"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Pencil, Trash2, Search, Database, Bot, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import {
    fetchObjectClassesRequest,
    createObjectClassRequest,
    updateObjectClassRequest,
    deleteObjectClassRequest,
} from "@/modules/admin/object-classes/actions"
import type { RootState } from "@/modules/rootReducer"

interface ObjectClass {
    _id: string
    name: string
    descriptive_label: string
    createdAt: string
    updatedAt: string
}

export default function TrainingDataPage() {
    const dispatch = useDispatch()
    const { objectClasses, loading, isSaving } = useSelector((state: RootState) => state.adminObjectClasses)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingClass, setEditingClass] = useState<ObjectClass | null>(null)
    const [formData, setFormData] = useState({ name: "" })

    useEffect(() => {
        dispatch(fetchObjectClassesRequest())
    }, [dispatch])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (editingClass) {
            dispatch(updateObjectClassRequest(editingClass._id, formData))
        } else {
            dispatch(createObjectClassRequest(formData))
        }

        toast.success(editingClass ? "Object class updated" : "Object class created")
        setIsModalOpen(false)
        setFormData({ name: "" })
        setEditingClass(null)
    }

    const handleEdit = (objectClass: ObjectClass) => {
        setEditingClass(objectClass)
        setFormData({ name: objectClass.name })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this object class?")) return
        dispatch(deleteObjectClassRequest(id))
        toast.success("Object class deleted")
    }

    const filteredClasses = (objectClasses as ObjectClass[]).filter(
        (cls) =>
            cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <Database className="w-8 h-8 text-primary" />
                            AI Training Data
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage object classes for AI bot training
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingClass(null)
                            setFormData({ name: "" })
                            setIsModalOpen(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Object Class
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search object classes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Classes</p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {objectClasses.length}
                                </p>
                            </div>
                            <Database className="w-10 h-10 text-primary/50" />
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Training</p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {filteredClasses.length}
                                </p>
                            </div>
                            <Bot className="w-10 h-10 text-green-500/50" />
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Search Results</p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {filteredClasses.length}
                                </p>
                            </div>
                            <Search className="w-10 h-10 text-blue-500/50" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredClasses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <AlertCircle className="w-12 h-12 mb-4" />
                            <p className="text-lg">No object classes found</p>
                            <p className="text-sm">Add your first object class to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Created At
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Updated At
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredClasses.map((cls) => (
                                        <tr key={cls._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                                                {cls.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(cls.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(cls.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(cls)}
                                                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cls._id)}
                                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            {editingClass ? "Edit Object Class" : "Add Object Class"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., cow, lion, car"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    {editingClass ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setEditingClass(null)
                                        setFormData({ name: "" })
                                    }}
                                    className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
