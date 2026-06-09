import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { RootState } from '@/modules/rootReducer'
import {
    fetchSolutionsRequest,
    deleteSolutionRequest,
    clearAllSolutionsRequest,
} from '@/modules/admin/solutions/actions'
import type { FetchSolutionsParams } from '@/modules/admin/solutions/actions'
import { Solution } from './_types'
import { ImageViewModal } from './_image-modal'
import { StatsCards, FiltersBar } from './_stats-filters'
import { SolutionsTable, PaginationBar } from './_table'

function useDebounce<T>(value: T, delay = 450): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(t)
    }, [value, delay])
    return debounced
}

export default function AdminSolutionsContent() {
    const dispatch = useDispatch()
    const { solutions, stats, pagination, loading } = useSelector(
        (state: RootState) => state.adminSolutions,
    )

    const [searchInput, setSearchInput] = useState('')
    const [serviceFilter, setServiceFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(20)
    const [viewSolution, setViewSolution] = useState<Solution | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [clearAllConfirm, setClearAllConfirm] = useState(false)

    const debouncedSearch = useDebounce(searchInput, 450)

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch, serviceFilter, typeFilter])

    // Fetch whenever params change
    useEffect(() => {
        dispatch(
            fetchSolutionsRequest({
                search: debouncedSearch,
                service: serviceFilter,
                type: typeFilter,
                page: currentPage,
                limit: itemsPerPage,
            }),
        )
    }, [dispatch, debouncedSearch, serviceFilter, typeFilter, currentPage, itemsPerPage])

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setDeleteConfirmId(id)
    }

    const handleClearAll = () => {
        setClearAllConfirm(true)
    }

    return (
        <>
            {viewSolution && (
                <ImageViewModal solution={viewSolution} onClose={() => setViewSolution(null)} />
            )}

            <StatsCards stats={stats} />

            <FiltersBar
                search={searchInput}
                onSearchChange={setSearchInput}
                service={serviceFilter}
                onServiceChange={setServiceFilter}
                type={typeFilter}
                onTypeChange={setTypeFilter}
                onRefresh={() =>
                    dispatch(
                        fetchSolutionsRequest({
                            search: debouncedSearch || '',
                            service: serviceFilter || '',
                            type: typeFilter || '',
                            page: 1,
                            limit: itemsPerPage,
                        }),
                    )
                }
                onClearAll={handleClearAll}
                refreshing={searchInput !== debouncedSearch}
            />

            <SolutionsTable
                solutions={solutions}
                loading={loading}
                pagination={pagination}
                onRowClick={setViewSolution}
                onDelete={handleDelete}
            />

            <PaginationBar
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                loading={loading}
            />

            {/* Delete Solution Confirmation */}
            <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Solution</AlertDialogTitle>
                        <AlertDialogDescription>Remove this cached solution?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deleteConfirmId) {
                                dispatch(
                                    deleteSolutionRequest(deleteConfirmId, {
                                        search: debouncedSearch || '',
                                        service: serviceFilter || '',
                                        type: typeFilter || '',
                                        page: currentPage,
                                        limit: itemsPerPage,
                                    }),
                                )
                                toast.success('Deleted')
                            }
                            setDeleteConfirmId(null)
                        }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Clear All Confirmation */}
            <AlertDialog open={clearAllConfirm} onOpenChange={setClearAllConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Solutions</AlertDialogTitle>
                        <AlertDialogDescription>This will delete ALL cached solutions. This cannot be undone!</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            dispatch(
                                clearAllSolutionsRequest({
                                    search: debouncedSearch || '',
                                    service: serviceFilter || '',
                                    type: typeFilter || '',
                                    page: currentPage,
                                    limit: itemsPerPage,
                                }),
                            )
                            toast.success('All solutions cleared')
                            setClearAllConfirm(false)
                        }}>Clear All</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    )
}
