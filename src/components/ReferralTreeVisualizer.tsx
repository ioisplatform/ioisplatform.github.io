import React, { useMemo, useState, useEffect } from 'react';
import { UserProfile, Plan } from '../types';
import { PLANS } from '../data/plansData';
import { maskMobile } from '../services/userService';
import {
  Network,
  Users,
  ShieldCheck,
  Clock,
  XCircle,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  GitBranch,
  ListTree,
  Eye,
  MessageCircle,
  Copy,
  Check,
  MapPin,
  Calendar,
  Wallet,
  Crown,
  UserPlus,
  ArrowUpLeft,
  X,
  Phone,
  Sparkles,
} from 'lucide-react';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

export interface ReferralTreeNode {
  user: UserProfile;
  levelFromRoot: number;
  levelFromFocus: number;
  plan: Plan;
  incentiveForViewer: number;
  directSponsorId?: string;
  directSponsorName?: string;
  children: ReferralTreeNode[];
  subtreeTotal: number;
  subtreeApproved: number;
  subtreePending: number;
  subtreeRejected: number;
}

interface ReferralTreeVisualizerProps {
  rootUser: UserProfile;
  allUsers: UserProfile[];
  onOpenPublicProfile?: (userOrHandle: UserProfile | string) => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
  onOpenChatWithUser?: (targetUser: UserProfile) => void;
}

type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';
type LayoutMode = 'org' | 'outline';

export const ReferralTreeVisualizer: React.FC<ReferralTreeVisualizerProps> = ({
  rootUser,
  allUsers,
  onOpenPublicProfile,
  onOpenSponsorAddMember,
  onOpenChatWithUser,
}) => {
  const [focusUserId, setFocusUserId] = useState<string>(rootUser.userId);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(rootUser.userId);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('org');
  const [zoom, setZoom] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMobileDetailSheet, setShowMobileDetailSheet] = useState<boolean>(false);

  // Sync focus when rootUser changes (e.g., different logged-in account)
  useEffect(() => {
    setFocusUserId(rootUser.userId);
    setSelectedNodeId(rootUser.userId);
    setCollapsedIds(new Set());
  }, [rootUser.userId]);

  // Normalized user lookup & parent-child adjacency index (strictly scoped to rootUser's downline + rootUser)
  const { userMap, childrenBySponsor, downlineLevelMap, parentMap } = useMemo(() => {
    const map = new Map<string, UserProfile>();
    const combinedUsers = [rootUser, ...(allUsers || [])];
    for (const u of combinedUsers) {
      if (!u?.userId) continue;
      const key = u.userId.trim().toUpperCase();
      if (!map.has(key)) {
        map.set(key, u);
      } else if (key === rootUser.userId.trim().toUpperCase()) {
        // Ensure latest rootUser object wins
        map.set(key, rootUser);
      }
    }

    const adj = new Map<string, UserProfile[]>();
    for (const u of map.values()) {
      const sp = (u.sponsorId || '').trim().toUpperCase();
      if (!sp || sp === u.userId.trim().toUpperCase()) continue;
      const list = adj.get(sp) || [];
      list.push(u);
      adj.set(sp, list);
    }

    // Sort children deterministically: approved first, then createdAt newest/oldest
    for (const [k, list] of adj.entries()) {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      adj.set(k, list);
    }

    // BFS from rootUser to determine true viewer-relative levels & prevent cycles
    const rootKey = rootUser.userId.trim().toUpperCase();
    const levelMap = new Map<string, number>();
    const pMap = new Map<string, string>();
    const queue: Array<{ id: string; level: number }> = [{ id: rootKey, level: 0 }];
    levelMap.set(rootKey, 0);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.level >= 7) continue; // safety bound
      const kids = adj.get(current.id) || [];
      for (const kid of kids) {
        const kidKey = kid.userId.trim().toUpperCase();
        if (!levelMap.has(kidKey)) {
          levelMap.set(kidKey, current.level + 1);
          pMap.set(kidKey, current.id);
          queue.push({ id: kidKey, level: current.level + 1 });
        }
      }
    }

    return {
      userMap: map,
      childrenBySponsor: adj,
      downlineLevelMap: levelMap,
      parentMap: pMap,
    };
  }, [rootUser, allUsers]);

  // Helper to check if a userId belongs to viewer's tree (root or descendant)
  const focusKey = useMemo(() => {
    const clean = focusUserId.trim().toUpperCase();
    return downlineLevelMap.has(clean) ? clean : rootUser.userId.trim().toUpperCase();
  }, [focusUserId, downlineLevelMap, rootUser.userId]);

  // Build recursive tree starting at `focusKey`
  const { treeRoot, nodeIndex, overallStats } = useMemo(() => {
    const index = new Map<string, ReferralTreeNode>();

    const buildNode = (
      uid: string,
      levelFromFocus: number,
      visited: Set<string>
    ): ReferralTreeNode | null => {
      const u = userMap.get(uid);
      if (!u || visited.has(uid)) return null;
      const nextVisited = new Set(visited);
      nextVisited.add(uid);

      const plan = PLANS.find((p) => p.id === u.selectedPlanId) || PLANS[0];
      const levelFromRoot = downlineLevelMap.get(uid) ?? levelFromFocus;
      const incentiveForViewer =
        levelFromRoot === 0
          ? 0
          : levelFromRoot === 1
          ? plan.instantPayout
          : Math.round(plan.instantPayout * 0.2);

      const sponsorKey = (u.sponsorId || '').trim().toUpperCase();
      const sponsorProfile = sponsorKey ? userMap.get(sponsorKey) : undefined;

      const rawChildren = levelFromFocus < 6 ? childrenBySponsor.get(uid) || [] : [];
      const childNodes: ReferralTreeNode[] = [];
      let subtreeTotal = 0;
      let subtreeApproved = 0;
      let subtreePending = 0;
      let subtreeRejected = 0;

      for (const child of rawChildren) {
        const childKey = child.userId.trim().toUpperCase();
        const childNode = buildNode(childKey, levelFromFocus + 1, nextVisited);
        if (childNode) {
          childNodes.push(childNode);
          subtreeTotal += 1 + childNode.subtreeTotal;
          if (childNode.user.paymentStatus === 'approved') subtreeApproved += 1;
          else if (childNode.user.paymentStatus === 'rejected') subtreeRejected += 1;
          else subtreePending += 1;

          subtreeApproved += childNode.subtreeApproved;
          subtreePending += childNode.subtreePending;
          subtreeRejected += childNode.subtreeRejected;
        }
      }

      const node: ReferralTreeNode = {
        user: u,
        levelFromRoot,
        levelFromFocus,
        plan,
        incentiveForViewer,
        directSponsorId: sponsorProfile?.userId || u.sponsorId,
        directSponsorName: sponsorProfile?.fullName || u.sponsorId,
        children: childNodes,
        subtreeTotal,
        subtreeApproved,
        subtreePending,
        subtreeRejected,
      };
      index.set(uid, node);
      return node;
    };

    const built = buildNode(focusKey, 0, new Set());
    const stats = built
      ? {
          total: built.subtreeTotal,
          direct: built.children.length,
          approved: built.subtreeApproved,
          pending: built.subtreePending,
          rejected: built.subtreeRejected,
        }
      : { total: 0, direct: 0, approved: 0, pending: 0, rejected: 0 };

    return { treeRoot: built, nodeIndex: index, overallStats: stats };
  }, [focusKey, userMap, childrenBySponsor, downlineLevelMap]);

  // Breadcrumb path from rootUser down to current focusUser
  const breadcrumbs = useMemo(() => {
    const chain: UserProfile[] = [];
    let cursor: string | undefined = focusKey;
    const guard = new Set<string>();
    while (cursor && !guard.has(cursor)) {
      guard.add(cursor);
      const u = userMap.get(cursor);
      if (u) chain.unshift(u);
      if (cursor === rootUser.userId.trim().toUpperCase()) break;
      cursor = parentMap.get(cursor);
    }
    return chain;
  }, [focusKey, userMap, parentMap, rootUser.userId]);

  // Search & Status matching helpers
  const cleanSearch = searchQuery.trim().toLowerCase();

  // Auto-expand ancestors when searching or filtering so matching deep members become visible
  const matchedAncestorIds = useMemo(() => {
    const ancestors = new Set<string>();
    if (!cleanSearch && statusFilter === 'all') return ancestors;

    const visit = (node: ReferralTreeNode): boolean => {
      const selfMatches =
        node.levelFromFocus > 0 &&
        (!cleanSearch ||
          node.user.fullName.toLowerCase().includes(cleanSearch) ||
          node.user.userId.toLowerCase().includes(cleanSearch) ||
          (node.user.username || '').toLowerCase().includes(cleanSearch) ||
          (node.user.mobileNumber || '').includes(cleanSearch) ||
          (node.user.district || '').toLowerCase().includes(cleanSearch)) &&
        (statusFilter === 'all' || node.user.paymentStatus === statusFilter);

      let childMatched = false;
      for (const c of node.children) {
        if (visit(c)) childMatched = true;
      }
      if (childMatched) {
        ancestors.add(node.user.userId.trim().toUpperCase());
      }
      return selfMatches || childMatched;
    };

    if (treeRoot) visit(treeRoot);
    return ancestors;
  }, [treeRoot, cleanSearch, statusFilter]);

  const isFiltering = cleanSearch.length > 0 || statusFilter !== 'all';

  const isNodeExpanded = (node: ReferralTreeNode): boolean => {
    const key = node.user.userId.trim().toUpperCase();
    if (isFiltering && matchedAncestorIds.has(key)) return true;
    return !collapsedIds.has(key);
  };

  const toggleExpand = (userId: string) => {
    const key = userId.trim().toUpperCase();
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAllNodes = () => {
    setCollapsedIds(new Set());
  };

  const collapseToDirectsOnly = () => {
    const next = new Set<string>();
    for (const [key, node] of nodeIndex.entries()) {
      if (node.levelFromFocus >= 1 && node.children.length > 0) {
        next.add(key);
      }
    }
    setCollapsedIds(next);
  };

  const handleSelectNode = (node: ReferralTreeNode) => {
    setSelectedNodeId(node.user.userId);
    setShowMobileDetailSheet(true);
  };

  const handleFocusSubtree = (targetUserId: string) => {
    setFocusUserId(targetUserId);
    setSelectedNodeId(targetUserId);
    setCollapsedIds(new Set());
  };

  const handleCopyUserId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {}
  };

  const selectedNode: ReferralTreeNode | null = useMemo(() => {
    const clean = selectedNodeId.trim().toUpperCase();
    return nodeIndex.get(clean) || treeRoot;
  }, [selectedNodeId, nodeIndex, treeRoot]);

  // Status badge helper (always icon + clear text, never hue-only)
  const getStatusMeta = (status: UserProfile['paymentStatus']) => {
    if (status === 'approved') {
      return {
        label: 'वेरिफाइड (Active)',
        shortLabel: 'Active',
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        ringClass: 'border-emerald-500/60',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      };
    }
    if (status === 'rejected') {
      return {
        label: 'रिजेक्ट (Rejected)',
        shortLabel: 'Rejected',
        badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
        ringClass: 'border-rose-500/60',
        icon: <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
      };
    }
    return {
      label: 'समीक्षाधीन (Pending)',
      shortLabel: 'Pending',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      ringClass: 'border-amber-500/60',
      icon: <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
    };
  };

  // Recursive Org Chart Node Renderer
  const renderOrgBranch = (node: ReferralTreeNode): React.ReactNode => {
    const uidKey = node.user.userId.trim().toUpperCase();
    const isRootOfView = node.levelFromFocus === 0;
    const isViewerSelf = uidKey === rootUser.userId.trim().toUpperCase();
    const isSelected = selectedNode?.user.userId.trim().toUpperCase() === uidKey;
    const hasChildren = node.children.length > 0;
    const expanded = isNodeExpanded(node);
    const statusMeta = getStatusMeta(node.user.paymentStatus);

    const exactFilterMatch =
      !isFiltering ||
      isRootOfView ||
      ((!cleanSearch ||
        node.user.fullName.toLowerCase().includes(cleanSearch) ||
        node.user.userId.toLowerCase().includes(cleanSearch) ||
        (node.user.username || '').toLowerCase().includes(cleanSearch) ||
        (node.user.mobileNumber || '').includes(cleanSearch) ||
        (node.user.district || '').toLowerCase().includes(cleanSearch)) &&
        (statusFilter === 'all' || node.user.paymentStatus === statusFilter));

    const hasMatchedDescendant = isFiltering && matchedAncestorIds.has(uidKey);
    const dimNode = isFiltering && !exactFilterMatch && !hasMatchedDescendant;

    return (
      <div key={node.user.userId} className="inline-flex flex-col items-center shrink-0">
        {/* Node Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleSelectNode(node)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectNode(node);
            }
          }}
          className={`relative w-52 sm:w-56 rounded-2xl p-3 text-left transition-all duration-150 cursor-pointer select-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isSelected
              ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/35 shadow-[0_0_24px_rgba(245,158,11,0.22)] -translate-y-0.5'
              : isRootOfView
              ? 'bg-slate-900 border-amber-500/70 hover:border-amber-400 shadow-lg'
              : `bg-slate-900/95 hover:bg-slate-900 ${statusMeta.ringClass} hover:border-amber-400/80`
          } ${dimNode ? 'opacity-35' : 'opacity-100'}`}
        >
          {/* Top Row: Level + Status */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <span className="text-[10.5px] font-bold text-slate-300 tabular-nums whitespace-nowrap">
              {isViewerSelf
                ? 'आप (Root)'
                : isRootOfView
                ? `Focus · L${node.levelFromRoot}`
                : node.levelFromRoot === 1
                ? 'Level 1 · Direct'
                : `Level ${node.levelFromRoot} Team`}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold whitespace-nowrap ${
                node.user.paymentStatus === 'approved'
                  ? 'text-emerald-400'
                  : node.user.paymentStatus === 'rejected'
                  ? 'text-rose-400'
                  : 'text-amber-300'
              }`}
            >
              {statusMeta.icon}
              <span>{statusMeta.shortLabel}</span>
            </span>
          </div>

          {/* Identity Row */}
          <div className="flex items-center gap-2.5 pt-2.5">
            <div
              className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 bg-slate-950 ${
                node.user.paymentStatus === 'approved'
                  ? 'border-emerald-400'
                  : node.user.paymentStatus === 'rejected'
                  ? 'border-rose-400'
                  : 'border-amber-400'
              }`}
            >
              <img
                src={node.user.photoUrl?.trim() || FALLBACK_AVATAR}
                alt={node.user.fullName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold text-white truncate">
                {node.user.fullName}
              </div>
              <div className="text-[10.5px] font-mono text-amber-300 truncate tabular-nums">
                {node.user.userId}
              </div>
              {node.user.username && (
                <div className="text-[10px] text-sky-300 truncate">@{node.user.username}</div>
              )}
            </div>
          </div>

          {/* Bottom Metrics Row: Plan + Incentive */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10.5px]">
            <span className="text-slate-300 truncate">
              {node.plan.name.split(' ')[0]} · <span className="font-mono tabular-nums text-white">₹{node.plan.price}</span>
            </span>
            {!isViewerSelf ? (
              <span className="font-mono tabular-nums font-bold text-emerald-400 whitespace-nowrap">
                +₹{node.incentiveForViewer}
              </span>
            ) : (
              <span className="font-mono tabular-nums font-bold text-amber-300 whitespace-nowrap">
                टीम: {node.subtreeTotal}
              </span>
            )}
          </div>
        </div>

        {/* Expand / Collapse Branch Pill & Connector Stem */}
        {hasChildren && (
          <div className="flex flex-col items-center">
            <div className="w-px h-3 bg-slate-600" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.user.userId);
              }}
              aria-label={expanded ? 'शाखा समेटें' : 'शाखा खोलें'}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer tabular-nums ${
                expanded
                  ? 'bg-slate-900 border-amber-500/60 text-amber-300 hover:bg-slate-800'
                  : 'bg-amber-400 border-amber-300 text-slate-950 hover:bg-amber-300 shadow'
              }`}
            >
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>{node.children.length} डायरेक्ट</span>
              {node.subtreeTotal > node.children.length && (
                <span className="opacity-75">({node.subtreeTotal})</span>
              )}
            </button>
            {expanded && <div className="w-px h-4 bg-slate-600" />}
          </div>
        )}

        {/* Children Row with Clean Tree Elbow Connectors */}
        {hasChildren && expanded && (
          <div className="flex items-start justify-center">
            {node.children.map((child, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === node.children.length - 1;
              const isOnly = node.children.length === 1;

              return (
                <div key={child.user.userId} className="relative flex flex-col items-center px-2.5 sm:px-3.5">
                  {/* Horizontal Top Connector Bar */}
                  {!isOnly && (
                    <div
                      className="absolute top-0 h-px bg-slate-600"
                      style={{
                        left: isFirst ? '50%' : 0,
                        right: isLast ? '50%' : 0,
                      }}
                    />
                  )}
                  {/* Vertical Drop Line into Child Card */}
                  <div className="w-px h-4 bg-slate-600" />
                  {renderOrgBranch(child)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Recursive Compact Outline Tree Renderer (ideal for narrow viewports or deep inspection)
  const renderOutlineBranch = (node: ReferralTreeNode, depth = 0): React.ReactNode => {
    const uidKey = node.user.userId.trim().toUpperCase();
    const isViewerSelf = uidKey === rootUser.userId.trim().toUpperCase();
    const isSelected = selectedNode?.user.userId.trim().toUpperCase() === uidKey;
    const hasChildren = node.children.length > 0;
    const expanded = isNodeExpanded(node);
    const statusMeta = getStatusMeta(node.user.paymentStatus);

    return (
      <div key={node.user.userId} className="space-y-1.5">
        <div
          className={`flex items-center gap-2 rounded-xl p-2.5 border transition cursor-pointer ${
            isSelected
              ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400/40'
              : 'bg-slate-900/75 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
          style={{ marginLeft: `${Math.min(depth, 5) * 18}px` }}
          onClick={() => handleSelectNode(node)}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.user.userId);
              }}
              className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-700 hover:border-amber-400 text-amber-300 flex items-center justify-center shrink-0 cursor-pointer"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <span className="w-7 h-7 flex items-center justify-center text-slate-600 shrink-0">•</span>
          )}

          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
            <img
              src={node.user.photoUrl?.trim() || FALLBACK_AVATAR}
              alt={node.user.fullName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white truncate">
                {node.user.fullName} {isViewerSelf ? '(आप)' : ''}
              </span>
              <span className="text-[10px] font-mono text-amber-300 tabular-nums">{node.user.userId}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
              <span>{node.levelFromRoot === 0 ? 'Root' : `Level ${node.levelFromRoot}`}</span>
              <span aria-hidden="true">·</span>
              <span>{node.plan.name} (₹{node.plan.price})</span>
              {!isViewerSelf && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-mono tabular-nums">+₹{node.incentiveForViewer}</span>
                </>
              )}
              {hasChildren && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-sky-300 tabular-nums">{node.subtreeTotal} टीम</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {statusMeta.icon}
            <span className="hidden sm:inline text-[11px] font-semibold text-slate-200">{statusMeta.shortLabel}</span>
          </div>
        </div>

        {hasChildren && expanded && (
          <div className="space-y-1.5">
            {node.children.map((child) => renderOutlineBranch(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Detailed Summary & Status Panel Content for Selected Member
  const renderInspectorContent = (node: ReferralTreeNode) => {
    const u = node.user;
    const isViewerSelf = u.userId.trim().toUpperCase() === rootUser.userId.trim().toUpperCase();
    const isCurrentFocus = u.userId.trim().toUpperCase() === focusKey;
    const statusMeta = getStatusMeta(u.paymentStatus);

    return (
      <div className="space-y-4">
        {/* Header Profile Block */}
        <div className="flex items-start gap-3 pb-3.5 border-b border-slate-800">
          <div
            className={`w-14 h-14 rounded-2xl overflow-hidden border-2 shrink-0 bg-slate-950 ${statusMeta.ringClass}`}
          >
            <img
              src={u.photoUrl?.trim() || FALLBACK_AVATAR}
              alt={u.fullName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-white truncate">
                {u.fullName} {isViewerSelf ? '(आप)' : ''}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="font-mono text-amber-300 font-bold tabular-nums">{u.userId}</span>
              <button
                type="button"
                onClick={() => handleCopyUserId(u.userId)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="User ID कॉपी करें"
              >
                {copiedId === u.userId ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
              {u.username && <span className="text-sky-300 font-mono">@{u.username}</span>}
            </div>

            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${statusMeta.badgeClass}`}>
              {statusMeta.icon}
              <span>{statusMeta.label}</span>
            </div>
          </div>
        </div>

        {/* Rejection Reason Alert if Rejected */}
        {u.paymentStatus === 'rejected' && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 space-y-1">
            <div className="font-bold text-rose-300">पेमेंट रिजेक्शन विवरण:</div>
            <p className="text-[11px] leading-relaxed">
              {u.rejectionReason || 'एडमिन सत्यापन में भुगतान विवरण स्पष्ट नहीं मिला। सदस्य अपनी प्रोफाइल से सही UTR अपडेट कर सकते हैं।'}
            </p>
          </div>
        )}

        {/* Key Summary Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10.5px] text-slate-400 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>चयनित प्लान</span>
            </span>
            <div className="font-bold text-white mt-0.5 truncate">{node.plan.name}</div>
            <div className="text-[11px] font-mono tabular-nums text-amber-300">₹{node.plan.price}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10.5px] text-slate-400 flex items-center gap-1">
              <Wallet className="w-3 h-3 text-emerald-400" />
              <span>{isViewerSelf ? 'कुल नेटवर्क' : 'आपका इंसेंटिव'}</span>
            </span>
            {isViewerSelf ? (
              <>
                <div className="font-bold text-emerald-300 font-mono tabular-nums mt-0.5">
                  {node.subtreeTotal} सदस्य
                </div>
                <div className="text-[11px] text-slate-400 tabular-nums">
                  {node.children.length} डायरेक्ट
                </div>
              </>
            ) : (
              <>
                <div className="font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                  ₹{node.incentiveForViewer}
                </div>
                <div className="text-[10.5px] text-slate-400">
                  {u.paymentStatus === 'approved' ? 'कन्फर्म कमाई' : 'सत्यापन पर संभावित'}
                </div>
              </>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10.5px] text-slate-400 flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-sky-400" />
              <span>नेटवर्क स्तर</span>
            </span>
            <div className="font-bold text-white mt-0.5">
              {node.levelFromRoot === 0
                ? 'Root (स्वयं)'
                : node.levelFromRoot === 1
                ? 'Level 1 (Direct)'
                : `Level ${node.levelFromRoot}`}
            </div>
            {node.directSponsorName && !isViewerSelf && (
              <div className="text-[10.5px] text-slate-400 truncate">
                स्पॉन्सर: {node.directSponsorName}
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10.5px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-400" />
              <span>जॉइनिंग तिथि</span>
            </span>
            <div className="font-bold text-white tabular-nums mt-0.5">
              {new Date(u.createdAt).toLocaleDateString('hi-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            {u.verifiedAt && u.paymentStatus === 'approved' && (
              <div className="text-[10.5px] text-emerald-400 tabular-nums">
                सत्यापित: {new Date(u.verifiedAt).toLocaleDateString('hi-IN')}
              </div>
            )}
          </div>
        </div>

        {/* Member's Own Sub-Team Breakdown */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>इनके नीचे की टीम (Sub-Team Status)</span>
            </span>
            <span className="font-mono font-bold text-white tabular-nums">{node.subtreeTotal} कुल</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] tabular-nums">
            <div className="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-mono font-bold text-amber-300">{node.children.length}</div>
              <div className="text-[10px] text-slate-400">डायरेक्ट</div>
            </div>
            <div className="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-mono font-bold text-emerald-400">{node.subtreeApproved}</div>
              <div className="text-[10px] text-slate-400">वेरिफाइड</div>
            </div>
            <div className="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-mono font-bold text-amber-400">{node.subtreePending}</div>
              <div className="text-[10px] text-slate-400">पेंडिंग</div>
            </div>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>मोबाइल</span>
            </span>
            <span className="font-mono text-slate-200 tabular-nums">
              {isViewerSelf ? u.mobileNumber : maskMobile(u.mobileNumber)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>स्थान</span>
            </span>
            <span className="text-slate-200 truncate max-w-[180px]">
              {[u.district, u.state].filter(Boolean).join(', ') || u.address || 'भारत'}
            </span>
          </div>
        </div>

        {/* Interactive Actions */}
        <div className="space-y-2 pt-1">
          {!isCurrentFocus && node.children.length > 0 && (
            <button
              type="button"
              onClick={() => handleFocusSubtree(u.userId)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <GitBranch className="w-4 h-4" />
              <span>इनकी सब-ट्री पर फोकस करें ({node.subtreeTotal} सदस्य)</span>
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {onOpenPublicProfile && (
              <button
                type="button"
                onClick={() => onOpenPublicProfile(u)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>पब्लिक प्रोफाइल</span>
              </button>
            )}

            {!isViewerSelf && onOpenChatWithUser && (
              <button
                type="button"
                onClick={() => onOpenChatWithUser(u)}
                className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>IOIS चैट</span>
              </button>
            )}

            {!isViewerSelf && (
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `नमस्ते ${u.fullName} जी! मैं आपका IOIS स्पॉन्सर (${rootUser.fullName} - ${rootUser.userId}) हूँ।`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  !onOpenPublicProfile || !onOpenChatWithUser ? 'sm:col-span-2' : 'sm:col-span-2'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp पर संदेश भेजें</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Summary & Controls */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <Network className="w-4 h-4 text-amber-400 shrink-0 mr-1" />
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.userId}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                  <button
                    type="button"
                    onClick={() => handleFocusSubtree(crumb.userId)}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                      isLast
                        ? 'bg-amber-400/15 text-amber-300 font-bold border border-amber-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {idx === 0 ? `आप (${crumb.fullName.split(' ')[0]})` : crumb.fullName}
                  </button>
                </React.Fragment>
              );
            })}
            {focusKey !== rootUser.userId.trim().toUpperCase() && (
              <button
                type="button"
                onClick={() => handleFocusSubtree(rootUser.userId)}
                className="ml-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowUpLeft className="w-3 h-3 text-amber-400" />
                <span>मुख्य ट्री</span>
              </button>
            )}
          </div>

          {/* Live Tree Counts */}
          <div className="flex items-center gap-3 text-xs tabular-nums flex-wrap text-slate-300">
            <span>
              कुल नेटवर्क: <strong className="text-white font-mono">{overallStats.total}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>
              डायरेक्ट: <strong className="text-amber-300 font-mono">{overallStats.direct}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-emerald-400">
              वेरिफाइड: <strong className="font-mono">{overallStats.approved}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-amber-300">
              पेंडिंग: <strong className="font-mono">{overallStats.pending}</strong>
            </span>
          </div>
        </div>

        {/* Search, Status Filter, Layout & Zoom Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="सदस्य खोजें (नाम, User ID, @username, शहर)..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-9 pr-8 py-2 text-xs outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                aria-label="खोज साफ़ करें"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            {/* Segmented Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              {(
                [
                  { id: 'all', label: 'सभी' },
                  { id: 'approved', label: 'वेरिफाइड' },
                  { id: 'pending', label: 'पेंडिंग' },
                  { id: 'rejected', label: 'रिजेक्ट' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Layout Switcher (Org Graph vs Outline) */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setLayoutMode('org')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition whitespace-nowrap cursor-pointer ${
                  layoutMode === 'org'
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ग्राफिक ब्रांच ट्री"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>ग्राफ ट्री</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('outline')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition whitespace-nowrap cursor-pointer ${
                  layoutMode === 'outline'
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="कॉम्पैक्ट लिस्ट ट्री"
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>लिस्ट ट्री</span>
              </button>
            </div>

            {/* Expand/Collapse + Zoom */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={expandAllNodes}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="सभी शाखाएं खोलें"
              >
                <ChevronsUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">सब खोलें</span>
              </button>
              <button
                type="button"
                onClick={collapseToDirectsOnly}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer whitespace-nowrap"
                title="केवल Level 1 तक समेटें"
              >
                केवल L1
              </button>

              {layoutMode === 'org' && (
                <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-slate-900 rounded-lg border border-slate-800 ml-1">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.65, Number((z - 0.1).toFixed(2))))}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                    aria-label="ज़ूम आउट"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="px-1.5 text-[10.5px] font-mono tabular-nums text-amber-300 cursor-pointer"
                    title="ज़ूम रीसेट करें"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(1.25, Number((z + 0.1).toFixed(2))))}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                    aria-label="ज़ूम इन"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Workspace: Tree Canvas + Member Summary & Status Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Interactive Visual Tree Viewport */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>सारांश व स्टेटस देखने के लिए ट्री में किसी भी सदस्य कार्ड पर क्लिक करें</span>
            </span>
            {layoutMode === 'org' && zoom !== 1 && (
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="text-amber-300 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Zoom</span>
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto max-h-[62dvh] min-h-[340px] custom-scrollbar">
            {!treeRoot ? (
              <div className="py-12 text-center text-xs text-slate-400">
                ट्री डेटा लोड हो रहा है...
              </div>
            ) : layoutMode === 'org' ? (
              <div className="min-w-full flex flex-col items-center">
                <div
                  className="origin-top transition-transform duration-150"
                  style={{ transform: `scale(${zoom})` }}
                >
                  {renderOrgBranch(treeRoot)}
                </div>

                {/* Empty Downline Prompt below Root */}
                {treeRoot.children.length === 0 && (
                  <div className="mt-6 max-w-md w-full p-5 rounded-2xl bg-slate-900/70 border border-dashed border-slate-700 text-center space-y-3">
                    <Users className="w-8 h-8 mx-auto text-amber-400/80" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">
                        अभी कोई डाउनलाइन सदस्य जुड़ा नहीं है
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        जैसे ही छात्र आपकी स्पॉन्सर ID (<span className="font-mono text-amber-300">{treeRoot.user.userId}</span>) से जुड़ेंगे, यहाँ पूरा मल्टी-लेवल ट्री दिखाई देगा।
                      </p>
                    </div>
                    {onOpenSponsorAddMember && (
                      <button
                        type="button"
                        onClick={() => onOpenSponsorAddMember()}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>+ नया सदस्य जोड़ें</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {renderOutlineBranch(treeRoot)}
                {treeRoot.children.length === 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                    अभी इस शाखा के नीचे कोई सदस्य नहीं जुड़ा है।
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Desktop Persistent Member Summary & Status Inspector */}
        <div className="hidden lg:block lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sticky top-2">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
            <span className="text-xs font-extrabold text-amber-300">
              चयनित सदस्य का सारांश व स्टेटस
            </span>
            <span className="text-[10.5px] text-slate-400">Live Inspector</span>
          </div>
          {selectedNode ? (
            renderInspectorContent(selectedNode)
          ) : (
            <div className="py-10 text-center text-xs text-slate-400">
              विवरण देखने के लिए किसी सदस्य को चुनें।
            </div>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Inline Summary Drawer when a node is tapped */}
      {showMobileDetailSheet && selectedNode && (
        <div className="lg:hidden rounded-2xl bg-slate-900 border-2 border-amber-500/50 p-4 space-y-2 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-extrabold text-amber-300">
              सदस्य सारांश व स्टेटस (Selected Member)
            </span>
            <button
              type="button"
              onClick={() => setShowMobileDetailSheet(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              aria-label="विवरण बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {renderInspectorContent(selectedNode)}
        </div>
      )}
    </div>
  );
};
