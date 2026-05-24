import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2, Edit3, X, Check, Shield, Users, Key, Search, ChevronLeft, ChevronRight, Sparkles, Crown, UserCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RootState } from '@/modules/rootReducer';
import * as actions from '@/modules/admin/permissions/actions';
import type { PermissionRole, PermissionUser, PermissionItem } from '@/modules/admin/permissions/reducer';

type Tab = 'roles' | 'users';

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'super-admin': Crown,
  'admin': Shield,
  'user': UserCheck,
};

const ROLE_COLORS: Record<string, string> = {
  'super-admin': 'from-amber-500 to-orange-600',
  'admin': 'from-indigo-500 to-violet-600',
  'user': 'from-emerald-500 to-teal-600',
};

function RoleBadge({ slug }: { slug: string }) {
  const colors = ROLE_COLORS[slug] || 'from-gray-400 to-gray-500';
  return (
    <span className={cn('text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r bg-clip-text text-transparent', colors)}>
      {slug.replace('-', ' ')}
    </span>
  );
}

export default function AdminPermissionsPage() {
  const dispatch = useDispatch();
  const {
    roles, rolesLoading, rolesSaving, rolesDeleting,
    users, usersLoading, usersPagination,
    permissions, permissionsLoading,
  } = useSelector((s: RootState) => s.adminPermissions);

  const [tab, setTab] = useState<Tab>('roles');
  const [modal, setModal] = useState<'role' | 'userRole' | null>(null);
  const [editingRole, setEditingRole] = useState<PermissionRole | null>(null);
  const [editingUser, setEditingUser] = useState<PermissionUser | null>(null);
  const [roleForm, setRoleForm] = useState({ name: '', slug: '', description: '', permissions: [] as string[], status: 'active' });
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);

  useEffect(() => {
    dispatch(actions.fetchRolesRequest());
    dispatch(actions.fetchPermissionsListRequest());
  }, [dispatch]);

  const loadUsers = useCallback(() => {
    dispatch(actions.fetchPermissionUsersRequest({ page: userPage, limit: 10, search: userSearch }));
  }, [dispatch, userPage, userSearch]);

  useEffect(() => {
    if (tab === 'users') loadUsers();
  }, [tab, loadUsers]);

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', slug: '', description: '', permissions: [], status: 'active' });
    setModal('role');
  };

  const openEditRole = (role: PermissionRole) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      slug: role.slug,
      description: role.description || '',
      permissions: role.permissions || [],
      status: role.status,
    });
    setModal('role');
  };

  const togglePerm = (key: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter(p => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const toggleCategory = (keys: string[]) => {
    setRoleForm(prev => {
      const allSelected = keys.every(k => prev.permissions.includes(k));
      if (allSelected) {
        return { ...prev, permissions: prev.permissions.filter(p => !keys.includes(p)) };
      }
      const toAdd = keys.filter(k => !prev.permissions.includes(k));
      return { ...prev, permissions: [...prev.permissions, ...toAdd] };
    });
  };

  const saveRole = () => {
    const data = { ...roleForm };
    if (editingRole) {
      dispatch(actions.updateRoleRequest({ ...data, roleId: editingRole.id }));
    } else {
      dispatch(actions.createRoleRequest(data));
    }
    setModal(null);
  };

  const deleteRole = (roleId: string) => {
    if (confirm('Delete this role?')) dispatch(actions.deleteRoleRequest(roleId));
  };

  const openUserRole = (user: PermissionUser) => {
    setEditingUser(user);
    setModal('userRole');
  };

  const saveUserRole = (newRole: string) => {
    if (editingUser) {
      dispatch(actions.updateUserRoleRequest(editingUser.id, newRole));
    }
    setModal(null);
  };

  const groupedPerms = permissions.reduce((acc: Record<string, PermissionItem[]>, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
  }, {});

  const permCount = roleForm.permissions.length;
  const totalPerms = permissions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage roles, permissions, and user access</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl w-fit">
        {([
          ['roles', 'Roles', Shield],
          ['users', 'Users', Users],
        ] as const).map(([k, label, Icon]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === k ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Roles Tab ─────────────────────────────────────────────────── */}
      {tab === 'roles' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{roles.length} role{roles.length !== 1 ? 's' : ''}</p>
            <button
              onClick={openCreateRole}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Role
            </button>
          </div>

          {rolesLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No roles yet</p>
              <p className="text-sm">Create your first role to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map(role => {
                const Icon = ROLE_ICONS[role.slug] || Shield;
                const colors = ROLE_COLORS[role.slug] || 'from-gray-500 to-gray-600';
                return (
                  <div
                    key={role.id}
                    className="relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
                  >
                    {/* Top gradient accent */}
                    <div className={cn('h-1 bg-gradient-to-r', colors)} />

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-sm',
                            role.slug === 'super-admin' ? 'from-amber-500/20 to-orange-600/20' :
                            role.slug === 'admin' ? 'from-indigo-500/20 to-violet-600/20' :
                            'from-emerald-500/20 to-teal-600/20',
                          )}>
                            <Icon className={cn('w-5 h-5', cn(
                              role.slug === 'super-admin' ? 'text-amber-500' :
                              role.slug === 'admin' ? 'text-indigo-500' :
                              'text-emerald-500',
                            ))} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">{role.name}</h3>
                            <RoleBadge slug={role.slug} />
                          </div>
                        </div>
                        {role.slug === 'super-admin' && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-semibold">
                            <Crown className="w-3 h-3" /> Default
                          </span>
                        )}
                      </div>

                      {role.description && (
                        <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3">{role.description}</p>
                      )}

                      {/* Permissions summary */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {role.permissions.length} permissions
                        </span>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions.slice(0, 3).map(p => (
                          <span key={p} className="px-2.5 py-1 bg-secondary/60 rounded-lg text-[11px] font-medium text-foreground/70">
                            {p.replace('.', ' · ')}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[11px] font-semibold">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                        {role.permissions.length === 0 && (
                          <span className="text-xs text-muted-foreground italic">No permissions assigned</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                        <button
                          onClick={() => openEditRole(role)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => deleteRole(role.id)}
                          disabled={rolesDeleting}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Users Tab ─────────────────────────────────────────────────── */}
      {tab === 'users' && (
        <div>
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No users found</p>
            </div>
          ) : (
            <>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      {['Name', 'Email', 'Role', 'Status', 'Joined', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            u.role === 'admin' || u.role === 'super-admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground',
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            u.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground',
                          )}>
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => openUserRole(u)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          >
                            <Key className="w-3 h-3" /> Change Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {usersPagination && usersPagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {usersPagination.page} of {usersPagination.pages} ({usersPagination.total} users)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUserPage(p => Math.max(1, p - 1))}
                      disabled={userPage <= 1}
                      className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setUserPage(p => Math.min(usersPagination.pages, p + 1))}
                      disabled={userPage >= usersPagination.pages}
                      className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Role Modal ─────────────────────────────────────────────────── */}
      {modal === 'role' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-3xl w-full max-w-5xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative flex items-center gap-4 p-6 border-b border-border bg-gradient-to-r from-muted/50 to-background">
              <div className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-sm',
                editingRole?.slug === 'super-admin' ? 'from-amber-500/20 to-orange-600/20' :
                editingRole?.slug === 'admin' ? 'from-indigo-500/20 to-violet-600/20' :
                'from-primary/20 to-accent/20',
              )}>
                {editingRole ? (
                  (() => {
                    const Icon = ROLE_ICONS[editingRole.slug] || Lock;
                    return <Icon className="w-6 h-6 text-primary" />;
                  })()
                ) : (
                  <Sparkles className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{editingRole ? `Edit ${editingRole.name}` : 'Create New Role'}</h2>
                <p className="text-sm text-muted-foreground">
                  {editingRole ? 'Modify role details and permissions' : 'Define a new role with custom permissions'}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic fields — two column grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role Name</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={e => {
                      const name = e.target.value;
                      setRoleForm(p => ({
                        ...p,
                        name,
                        slug: name.toLowerCase().replace(/\s+/g, '-'),
                      }));
                    }}
                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="e.g. Content Editor"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    value={roleForm.slug}
                    onChange={e => setRoleForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm font-mono text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="content-editor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                  <select
                    value={roleForm.status}
                    onChange={e => setRoleForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                  <input
                    type="text"
                    value={roleForm.description}
                    onChange={e => setRoleForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Brief description of this role"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Permissions</label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {permCount} of {totalPerms} selected
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRoleForm(p => ({ ...p, permissions: permissions.map(x => x.key) }))}
                      className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Select All
                    </button>
                    <span className="text-border">|</span>
                    <button
                      type="button"
                      onClick={() => setRoleForm(p => ({ ...p, permissions: [] }))}
                      className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${(permCount / Math.max(1, totalPerms)) * 100}%` }}
                  />
                </div>

                {permissionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {Object.entries(groupedPerms).map(([category, perms]) => {
                      const catKeys = perms.map(p => p.key);
                      const selected = catKeys.filter(k => roleForm.permissions.includes(k)).length;
                      const allSelected = selected === catKeys.length;
                      const someSelected = selected > 0 && !allSelected;

                      return (
                        <div
                          key={category}
                          className={cn(
                            'rounded-2xl border-2 transition-all duration-200',
                            allSelected ? 'border-primary/40 bg-primary/[0.04] shadow-sm shadow-primary/5' :
                            someSelected ? 'border-primary/20 bg-primary/[0.02]' :
                            'border-border bg-card hover:border-muted-foreground/20',
                          )}
                        >
                          {/* Category header */}
                          <button
                            type="button"
                            onClick={() => toggleCategory(catKeys)}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-left rounded-t-2xl hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
                                allSelected ? 'bg-primary border-primary shadow-sm shadow-primary/30' :
                                someSelected ? 'border-primary/50 bg-primary/10' :
                                'border-muted-foreground/25 group-hover:border-muted-foreground/40',
                              )}>
                                {allSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                {someSelected && <div className="w-2 h-0.5 bg-primary rounded-full" />}
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-semibold">{category}</span>
                              </div>
                            </div>
                            <span className={cn(
                              'text-[11px] font-semibold rounded-full px-2.5 py-0.5 transition-colors',
                              allSelected ? 'bg-primary text-primary-foreground' :
                              someSelected ? 'bg-primary/10 text-primary' :
                              'bg-muted text-muted-foreground',
                            )}>
                              {selected}/{catKeys.length}
                            </span>
                          </button>

                          {/* Divider */}
                          <div className="h-px bg-border/50 mx-4" />

                          {/* Permission items */}
                          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {perms.map(p => {
                              const isSelected = roleForm.permissions.includes(p.key);
                              return (
                                <button
                                  key={p.key}
                                  type="button"
                                  onClick={() => togglePerm(p.key)}
                                  className={cn(
                                    'flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all duration-150',
                                    isSelected
                                      ? 'bg-primary/10 border border-primary/20 shadow-sm'
                                      : 'border border-transparent hover:bg-muted/50 hover:border-border',
                                  )}
                                >
                                  <div className={cn(
                                    'w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
                                    isSelected
                                      ? 'bg-primary border-primary'
                                      : 'border-muted-foreground/30 group-hover/permit:border-muted-foreground/50',
                                  )}>
                                    {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                                  </div>
                                  <span className={cn(
                                    'text-[12px] leading-tight transition-colors',
                                    isSelected ? 'font-semibold text-primary' : 'text-muted-foreground',
                                  )}>
                                    {p.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 p-4 border-t border-border bg-muted/20">
              {editingRole && (
                <button
                  onClick={() => deleteRole(editingRole.id)}
                  disabled={rolesDeleting}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-destructive/70 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Role
                </button>
              )}
              {!editingRole && <div />}
              <div className="flex gap-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveRole}
                  disabled={rolesSaving || !roleForm.name.trim() || !roleForm.slug.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                  {rolesSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editingRole ? (
                    <>
                      <Check className="w-4 h-4" /> Save Changes
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Create Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── User Role Modal ────────────────────────────────────────────── */}
      {modal === 'userRole' && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl w-full max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Change User Role</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {editingUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{editingUser.name}</p>
                  <p className="text-xs text-muted-foreground">{editingUser.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Role</label>
                <select
                  defaultValue={editingUser.role}
                  onChange={e => saveUserRole(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.slug}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-xl text-sm hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
