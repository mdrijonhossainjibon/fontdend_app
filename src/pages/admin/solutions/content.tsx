import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, message } from 'antd'
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
        Modal.confirm({
            title: 'Delete Solution',
            content: 'Remove this cached solution?',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                dispatch(
                    deleteSolutionRequest(id, {
                        search: debouncedSearch || '',
                        service: serviceFilter || '',
                        type: typeFilter || '',
                        page: currentPage,
                        limit: itemsPerPage,
                    }),
                )
                message.success('Deleted')
            },
        })
    }

    const handleClearAll = () => {
        Modal.confirm({
            title: 'Clear All Solutions',
            content: 'This will delete ALL cached solutions. This cannot be undone!',
            okText: 'Clear All',
            okType: 'danger',
            onOk: () => {
                dispatch(
                    clearAllSolutionsRequest({
                        search: debouncedSearch || '',
                        service: serviceFilter || '',
                        type: typeFilter || '',
                        page: currentPage,
                        limit: itemsPerPage,
                    }),
                )
                message.success('All solutions cleared')
            },
        })
    }

    return (
        <>
            {viewSolution && (
                <ImageViewModal solution={viewSolution} onClose={() => setViewSolution(null)} />
            )}

            <StatsCards stats={stats} />

            <FiltersBar
                searchTerm={searchInput}
                serviceFilter={serviceFilter}
                typeFilter={typeFilter}
                onSearch={setSearchInput}
                onService={setServiceFilter}
                onType={setTypeFilter}
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
                isSearching={searchInput !== debouncedSearch}
            />

            <SolutionsTable
                solutions={solutions}
                loading={loading}
                pagination={pagination}
                onRowClick={setViewSolution}
                onDelete={handleDelete}
            />

            {pagination && (
                <PaginationBar
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    pagination={pagination}
                    loading={loading}
                    solutionCount={solutions.length}
                    onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    onNext={() =>
                        setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    onPageChange={setCurrentPage}
                />
            )}

            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    )
}
