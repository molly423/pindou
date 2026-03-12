/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Compass, 
  Grid3X3, 
  User, 
  Search, 
  Bell, 
  Plus, 
  Heart, 
  ArrowLeft, 
  Share2, 
  Download, 
  Bookmark,
  Settings,
  Edit,
  Verified,
  Eraser,
  Pipette,
  RotateCcw,
  RotateCw,
  Layers,
  Minus,
  ShoppingCart,
  Check,
  Trash2,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PATTERNS, MOCK_COMMENTS, PALETTE_COLORS, MARD_COLORS_FULL, MOCK_FOLLOWING } from './constants';
import { Pattern, BeadColor, UserProfile, SavedProject } from './types';
import { supabase } from './supabaseClient';
import { createApiClient } from './api';

// --- Components ---

const SavedProjectsModal = ({ 
  isOpen, 
  onClose, 
  projects, 
  onLoad,
  onDelete
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  projects: SavedProject[], 
  onLoad: (project: SavedProject) => void,
  onDelete: (ids: string[]) => void
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map(p => p.id));
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 个作品吗？`)) {
      onDelete(selectedIds);
      setSelectedIds([]);
      setIsEditMode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">我的图纸</h3>
            {projects.length > 0 && (
              <button 
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  setSelectedIds([]);
                }}
                className={`text-xs px-2 py-1 rounded-md font-bold transition-colors ${isEditMode ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {isEditMode ? '取消选择' : '批量管理'}
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Layers size={48} className="mx-auto mb-4 opacity-20" />
              <p>暂无保存的图纸</p>
            </div>
          ) : (
            projects.sort((a, b) => b.updatedAt - a.updatedAt).map((project) => (
              <div key={project.id} className="relative flex items-center gap-2">
                {isEditMode && (
                  <button 
                    onClick={() => toggleSelect(project.id)}
                    className={`shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.includes(project.id) ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}
                  >
                    {selectedIds.includes(project.id) && <Check size={14} strokeWidth={3} />}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (isEditMode) {
                      toggleSelect(project.id);
                    } else {
                      onLoad(project);
                      onClose();
                    }
                  }}
                  className={`flex-1 flex items-center gap-4 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left group ${selectedIds.includes(project.id) ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
                >
                  <div className="size-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    <div 
                      className="grid gap-[0.5px]" 
                      style={{ 
                        gridTemplateColumns: `repeat(${project.width}, 1fr)`,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      {project.grid.map((c, i) => (
                        <div key={i} style={{ backgroundColor: c || '#f8fafc' }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{project.title}</p>
                    <p className="text-xs text-slate-500">{project.width}x{project.height} • {new Date(project.updatedAt).toLocaleDateString()}</p>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>

        {isEditMode && projects.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={selectAll}
                className="text-xs font-bold text-primary hover:underline"
              >
                {selectedIds.length === projects.length ? '取消全选' : '全选'}
              </button>
              <span className="text-sm text-slate-500 font-medium">已选择 {selectedIds.length} 项</span>
            </div>
            <button 
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${selectedIds.length > 0 ? 'bg-red-500 text-white shadow-lg shadow-red-200 hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              <Trash2 size={16} />
              <span>删除选中</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const NewCanvasModal = ({ 
  isOpen, 
  onClose, 
  onCreate 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onCreate: (w: number, h: number, initialGrid?: string[][]) => void 
}) => {
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const presets = [16, 24, 32, 48];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Use the current width/height for the perler bead grid
        canvas.width = width;
        canvas.height = height;

        // Draw and resize image to the grid size
        ctx.drawImage(img, 0, 0, width, height);
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const newGrid: string[][] = Array(height).fill(null).map(() => Array(width).fill('#FFFFFF'));

        // Helper to find closest color in palette
        const getClosestColor = (r: number, g: number, b: number) => {
          let minDistance = Infinity;
          let closestHex = '#FFFFFF';
          
          for (const color of MARD_COLORS_FULL) {
            const cr = parseInt(color.hex.slice(1, 3), 16);
            const cg = parseInt(color.hex.slice(3, 5), 16);
            const cb = parseInt(color.hex.slice(5, 7), 16);
            
            // Euclidean distance in RGB space
            const distance = Math.sqrt(
              Math.pow(r - cr, 2) + 
              Math.pow(g - cg, 2) + 
              Math.pow(b - cb, 2)
            );
            
            if (distance < minDistance) {
              minDistance = distance;
              closestHex = color.hex;
            }
          }
          return closestHex;
        };

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a < 128) {
              newGrid[y][x] = 'transparent';
            } else {
              newGrid[y][x] = getClosestColor(r, g, b);
            }
          }
        }

        onCreate(width, height, newGrid);
        setIsProcessing(false);
        onClose();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold">新建画布</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">宽度 (像素)</label>
              <input 
                type="number" 
                value={width}
                onChange={(e) => setWidth(Math.min(64, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">高度 (像素)</label>
              <input 
                type="number" 
                value={height}
                onChange={(e) => setHeight(Math.min(64, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase">常用尺寸</label>
            <div className="flex gap-2">
              {presets.map(p => (
                <button 
                  key={p}
                  onClick={() => { setWidth(p); setHeight(p); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${width === p && height === p ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200 hover:border-primary/50'}`}
                >
                  {p}x{p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-primary bg-primary/5 border-2 border-dashed border-primary/20 hover:bg-primary/10 transition-all group"
            >
              <Upload size={20} className="group-hover:-translate-y-0.5 transition-transform" />
              {isProcessing ? '正在处理...' : '上传并转换图片'}
            </button>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              图片将自动缩放至 {width}x{height} 并转换为拼豆图纸
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => {
              onCreate(width, height);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            确认创建
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const FollowingListModal = ({ 
  isOpen, 
  onClose,
  followedAuthors,
  onToggleFollow
}: { 
  isOpen: boolean, 
  onClose: () => void,
  followedAuthors: string[],
  onToggleFollow: (author: string) => void
}) => {
  if (!isOpen) return null;

  // In a real app, we'd fetch user details for each followed author name
  // For this demo, we'll use MOCK_FOLLOWING as the source of truth for details
  const displayedFollowing = MOCK_FOLLOWING.filter(user => followedAuthors.includes(user.name));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold">关注列表</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {displayedFollowing.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <User size={48} className="mx-auto mb-4 opacity-20" />
              <p>暂无关注作者</p>
            </div>
          ) : (
            displayedFollowing.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <img src={user.avatar} alt={user.name} className="size-12 rounded-full border border-slate-100" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.bio}</p>
                </div>
                <button 
                  onClick={() => onToggleFollow(user.name)}
                  className="px-4 py-1.5 rounded-full border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
                >
                  已关注
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  profile, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  profile: UserProfile, 
  onSave: (p: UserProfile) => void 
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const avatars = [
    'https://picsum.photos/seed/pixelmaster/200/200',
    'https://picsum.photos/seed/user1/200/200',
    'https://picsum.photos/seed/user2/200/200',
    'https://picsum.photos/seed/user3/200/200',
    'https://picsum.photos/seed/user4/200/200',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold">编辑个人资料</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">更换头像</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {avatars.map((url, i) => (
                <button 
                  key={i}
                  onClick={() => setFormData({ ...formData, avatar: url })}
                  className={`size-16 rounded-full shrink-0 border-4 transition-all ${formData.avatar === url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                >
                  <img src={url} alt="Avatar option" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">昵称</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="输入你的昵称"
            />
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">性别</label>
            <div className="flex gap-2">
              {(['Male', 'Female', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${formData.gender === g ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200 hover:border-primary/50'}`}
                >
                  {g === 'Male' ? '男' : g === 'Female' ? '女' : '其他'}
                </button>
              ))}
            </div>
          </div>

          {/* Bio Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">简介</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder="介绍一下你自己吧"
              rows={3}
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            保存
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ColorPickerModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (color: { id: string, hex: string }) => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold">选择 Mard 色号</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-3">
          {MARD_COLORS_FULL.map((color) => (
            <button
              key={color.id}
              onClick={() => {
                onSelect({ id: color.id, hex: color.hex });
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div 
                className="size-12 rounded-lg border border-slate-200 shadow-sm group-hover:scale-110 transition-transform"
                style={{ background: color.hex }}
              />
              <span className="text-[10px] font-bold text-slate-600">{color.id}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const BottomNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: '首页', icon: HomeIcon },
    { id: 'explore', label: '探索', icon: Compass },
    { id: 'studio', label: '工作室', icon: Grid3X3 },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-primary/10 px-4 pb-6 pt-3 flex justify-around items-center max-w-2xl mx-auto rounded-t-2xl shadow-2xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`}
        >
          <tab.icon size={24} fill={activeTab === tab.id ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const PatternCard: React.FC<{ 
  pattern: Pattern, 
  onClick: () => void, 
  isLiked: boolean, 
  onLike: (e: React.MouseEvent) => void 
}> = ({ 
  pattern, 
  onClick, 
  isLiked, 
  onLike 
}) => {
  // Random height for masonry effect simulation
  const heights = ['aspect-[3/4]', 'aspect-[2/3]', 'aspect-[4/5]', 'aspect-square'];
  const heightClass = heights[parseInt(pattern.id) % heights.length];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="flex flex-col group cursor-pointer mb-4"
    >
      <div className={`relative overflow-hidden rounded-xl bg-slate-200 ${heightClass}`}>
        <img 
          src={pattern.image} 
          alt={pattern.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button 
          onClick={onLike}
          className={`absolute top-2 right-2 size-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${isLiked ? 'bg-primary text-white scale-110' : 'bg-black/20 text-white hover:bg-black/40'}`}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        </button>
        {pattern.beadCount && (
          <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-full text-[10px] font-bold">
            {pattern.beadCount} 颗
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-slate-900 text-sm font-bold truncate tracking-tighter">{pattern.title}</p>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1.5">
            <img src={pattern.authorAvatar} alt={pattern.author} className="size-4 rounded-full" referrerPolicy="no-referrer" />
            <span className="text-slate-500 text-[10px] truncate max-w-[70px] tracking-tighter">{pattern.author}</span>
          </div>
          <div className={`flex items-center gap-0.5 ${isLiked ? 'text-primary' : 'text-slate-400'}`}>
            <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
            <span className="text-[11px] font-bold">
              {isLiked ? pattern.likes + 1 : pattern.likes}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Pages ---

const HomePage = ({ 
  onSelectPattern, 
  likedPatternIds, 
  onToggleLike,
  followedAuthors
}: { 
  onSelectPattern: (p: Pattern) => void,
  likedPatternIds: string[],
  onToggleLike: (id: string) => void,
  followedAuthors: string[]
}) => {
  const [activeHomeTab, setActiveHomeTab] = useState('精选');

  const filteredPatterns = activeHomeTab === '关注'
    ? MOCK_PATTERNS.filter(p => followedAuthors.includes(p.author))
    : MOCK_PATTERNS;

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-30 bg-background-light/80 backdrop-blur-md border-b border-primary/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-4">
          <div className="flex size-10 items-center justify-center bg-primary/20 rounded-full text-primary">
            <Grid3X3 size={20} />
          </div>
          <h1 className="text-slate-900 text-xl font-bold flex-1 text-center">拼豆工艺</h1>
          <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary">
            <Bell size={20} />
          </button>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-stretch rounded-xl bg-white border border-primary/10 shadow-sm overflow-hidden">
            <div className="text-primary/60 flex items-center justify-center pl-4">
              <Search size={20} />
            </div>
            <input 
              className="flex w-full border-none bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-400 text-base py-3 px-4" 
              placeholder="搜索图纸 (例如：狐狸, 复古)" 
            />
          </div>
        </div>
        <nav className="flex mt-4 justify-between max-w-2xl mx-auto">
          {['精选', '最新', '关注'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveHomeTab(tab)}
              className={`flex-1 pb-2 pt-2 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeHomeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {filteredPatterns.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <User size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无关注作者的作品</p>
          </div>
        ) : (
          <div className="columns-2 gap-4">
            {filteredPatterns.map((pattern) => (
              <PatternCard 
                key={pattern.id} 
                pattern={pattern} 
                onClick={() => onSelectPattern(pattern)}
                isLiked={likedPatternIds.includes(pattern.id)}
                onLike={(e) => {
                  e.stopPropagation();
                  onToggleLike(pattern.id);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-24 right-6 z-40">
        <button className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-transform hover:scale-110 active:scale-95">
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
};

const PatternDetailPage = ({ 
  pattern, 
  onBack,
  isLiked,
  onToggleLike,
  isFollowing,
  onToggleFollow
}: { 
  pattern: Pattern, 
  onBack: () => void,
  isLiked: boolean,
  onToggleLike: (id: string) => void,
  isFollowing: boolean,
  onToggleFollow: (author: string) => void
}) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-[60] bg-background-light overflow-y-auto pb-24"
    >
      <header className="flex items-center bg-background-light p-4 pb-2 justify-between sticky top-0 z-10 border-b border-primary/10">
        <button onClick={onBack} className="text-slate-900 size-10 flex items-center justify-center hover:bg-primary/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold flex-1 text-center">图纸详情</h2>
        <button 
          onClick={() => onToggleLike(pattern.id)}
          className={`size-10 flex items-center justify-center rounded-full transition-colors ${isLiked ? 'text-primary bg-primary/10' : 'text-slate-900 hover:bg-primary/10'}`}
        >
          <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4">
        <div className="aspect-square w-full bg-center bg-cover rounded-xl shadow-lg border-4 border-white mb-6" style={{ backgroundImage: `url(${pattern.image})` }}></div>
        
        <h1 className="text-slate-900 text-3xl font-extrabold leading-tight mb-4">{pattern.title}</h1>
        
        <div className="flex items-center gap-3 mb-6">
          <img src={pattern.authorAvatar} alt={pattern.author} className="size-12 rounded-full border-2 border-primary" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <p className="text-slate-900 font-bold">{pattern.author}</p>
            <p className="text-slate-500 text-sm">Published {pattern.publishedAt} • {pattern.difficulty}</p>
          </div>
          <button 
            onClick={() => onToggleFollow(pattern.author)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isFollowing ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-primary text-white shadow-md shadow-primary/20 hover:scale-105'}`}
          >
            {isFollowing ? '已关注' : '+ 关注'}
          </button>
        </div>

        <p className="text-slate-700 leading-relaxed mb-8">{pattern.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
            <Download size={20} /> 下载 PDF
          </button>
          <button className="flex items-center justify-center gap-2 bg-primary/20 text-primary py-3 rounded-lg font-bold hover:bg-primary/30 transition-colors">
            <Bookmark size={20} /> 保存图纸
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-200 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-300 transition-colors">
            <Share2 size={20} /> 分享
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">拼豆颜色清单</h3>
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">5小时前</span>
          </div>
          <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">颜色</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">色号 (美德/Mard)</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-right">数量</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pattern.colors?.map((color, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-4 flex items-center gap-3">
                      <div className="size-6 rounded-full border border-slate-200" style={{ backgroundColor: color.hex }}></div>
                      <span className="font-medium">{color.name}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{color.code}</td>
                    <td className="px-4 py-4 text-right font-bold">{color.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">评论 ({MOCK_COMMENTS.length})</h3>
          <div className="flex gap-4 mb-8">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <User className="text-primary" size={20} />
            </div>
            <div className="flex-1">
              <textarea 
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" 
                placeholder="写下你的评论..." 
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">发布评论</button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {MOCK_COMMENTS.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <img src={comment.avatar} alt={comment.user} className="size-10 rounded-full" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{comment.user}</span>
                    <span className="text-xs text-slate-500">{comment.time}</span>
                  </div>
                  <p className="text-sm text-slate-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

const ProfilePage = ({ 
  onBack, 
  profile, 
  onUpdateProfile, 
  onSelectPattern,
  likedPatternIds,
  onToggleLike,
  followedAuthors,
  onToggleFollow
}: { 
  onBack: () => void, 
  profile: UserProfile, 
  onUpdateProfile: (p: UserProfile) => void,
  onSelectPattern: (p: Pattern) => void,
  likedPatternIds: string[],
  onToggleLike: (id: string) => void,
  followedAuthors: string[],
  onToggleFollow: (author: string) => void
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowingListOpen, setIsFollowingListOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'works' | 'liked'>('works');

  const displayedPatterns = activeSubTab === 'works' 
    ? MOCK_PATTERNS // In a real app, this would be filtered by author
    : MOCK_PATTERNS.filter(p => likedPatternIds.includes(p.id));

  return (
    <div className="pb-24">
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onSave={onUpdateProfile} 
      />

      <FollowingListModal 
        isOpen={isFollowingListOpen} 
        onClose={() => setIsFollowingListOpen(false)} 
        followedAuthors={followedAuthors}
        onToggleFollow={onToggleFollow}
      />

      <header className="flex items-center justify-between p-4 sticky top-0 bg-background-light/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10">
            <ArrowLeft size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10">
            <Settings size={20} />
          </button>
        </div>
        <h1 className="text-lg font-bold">个人中心</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10">
          <Share2 size={20} />
        </button>
      </header>

      <div className="flex flex-col items-center px-4 py-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-primary/20 p-1">
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-4 border-background-light flex items-center justify-center">
            <Verified size={14} />
          </div>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-slate-500 mt-1 text-sm">{profile.bio}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
            {profile.gender === 'Male' ? '♂ 男' : profile.gender === 'Female' ? '♀ 女' : '⚥ 其他'}
          </div>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="mt-6 w-full max-w-[200px] bg-primary text-white py-2.5 rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <Edit size={18} />
          <span>编辑资料</span>
        </button>
      </div>

      <div className="flex px-4 py-4 gap-3">
        {[
          { label: '图纸', value: '24', onClick: () => {} },
          { label: '粉丝', value: '1.2k', onClick: () => {} },
          { label: '关注', value: '350', onClick: () => setIsFollowingListOpen(true) },
        ].map((stat) => (
          <button 
            key={stat.label} 
            onClick={stat.onClick}
            className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center border border-slate-100 hover:border-primary/30 transition-colors"
          >
            <span className="text-xl font-bold">{stat.value}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex border-b border-slate-200 mt-2">
        <button 
          onClick={() => setActiveSubTab('works')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeSubTab === 'works' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
        >
          我的作品
        </button>
        <button 
          onClick={() => setActiveSubTab('liked')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeSubTab === 'liked' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
        >
          赞过
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {displayedPatterns.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400">
            <Heart size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无内容</p>
          </div>
        ) : (
          displayedPatterns.map((pattern) => (
            <div 
              key={pattern.id} 
              onClick={() => onSelectPattern(pattern)}
              className="flex flex-col group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl bg-white overflow-hidden border border-slate-100 relative">
                <img src={pattern.image} alt={pattern.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(pattern.id);
                  }}
                  className={`absolute top-2 right-2 size-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${likedPatternIds.includes(pattern.id) ? 'bg-primary text-white' : 'bg-black/20 text-white'}`}
                >
                  <Heart size={12} fill={likedPatternIds.includes(pattern.id) ? "currentColor" : "none"} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold">
                  <Heart size={10} fill="currentColor" />
                  {likedPatternIds.includes(pattern.id) ? pattern.likes + 1 : pattern.likes}
                </div>
              </div>
              <p className="mt-2 text-sm font-bold truncate">{pattern.title}</p>
              <p className="text-xs text-slate-400">{pattern.gridSize} 网格</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EditorPage = ({ 
  onBack, 
  onSave, 
  onDeleteProject,
  savedProjects 
}: { 
  onBack: () => void, 
  onSave: (project: Omit<SavedProject, 'updatedAt'>) => void,
  onDeleteProject: (ids: string[]) => void,
  savedProjects: SavedProject[]
}) => {
  const [gridSize, setGridSize] = useState({ width: 16, height: 16 });
  const [history, setHistory] = useState<((string | null)[])[]>([Array(16 * 16).fill(null)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [palette, setPalette] = useState(PALETTE_COLORS);
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0].hex);
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser' | 'picker'>('brush');
  const [zoom, setZoom] = useState(200);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isNewCanvasModalOpen, setIsNewCanvasModalOpen] = useState(false);
  const [isSavedProjectsOpen, setIsSavedProjectsOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('未命名作品');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const grid = history[historyIndex];

  const handleCreateNewCanvas = (w: number, h: number, initialGrid?: string[][]) => {
    setGridSize({ width: w, height: h });
    let newGrid;
    if (initialGrid) {
      newGrid = initialGrid.flat().map(color => color === 'transparent' ? null : color);
    } else {
      newGrid = Array(w * h).fill(null);
    }
    setHistory([newGrid]);
    setHistoryIndex(0);
    setActiveTool('brush');
    setProjectTitle('未命名作品');
    setCurrentProjectId(null);
  };

  const handleLoadProject = (project: SavedProject) => {
    setGridSize({ width: project.width, height: project.height });
    setHistory([project.grid]);
    setHistoryIndex(0);
    setProjectTitle(project.title);
    setActiveTool('brush');
    setCurrentProjectId(project.id);
  };

  const handleSave = () => {
    const id = currentProjectId || Math.random().toString(36).substring(2, 9);
    onSave({
      id,
      title: projectTitle,
      grid: history[historyIndex],
      width: gridSize.width,
      height: gridSize.height
    });
    setCurrentProjectId(id);
    alert('作品已保存');
  };

  const handleCellClick = (index: number) => {
    const currentGrid = history[historyIndex];
    
    if (activeTool === 'picker') {
      const color = currentGrid[index];
      if (color) {
        setSelectedColor(color);
        setActiveTool('brush');
      }
      return;
    }

    const targetColor = activeTool === 'eraser' ? null : selectedColor;
    if (currentGrid[index] === targetColor) return;

    const newGrid = [...currentGrid];
    newGrid[index] = targetColor;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newGrid);
    
    // Limit history to 50 steps for performance
    if (newHistory.length > 50) {
      newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleAddColor = (newColor: { id: string, hex: string }) => {
    // Check if color already exists in palette
    if (!palette.find(c => c.hex === newColor.hex)) {
      setPalette([...palette, newColor]);
    }
    setSelectedColor(newColor.hex);
  };

  const handleDelete = (ids: string[]) => {
    onDeleteProject(ids);
    if (currentProjectId && ids.includes(currentProjectId)) {
      handleCreateNewCanvas(16, 16);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background-light">
      <ColorPickerModal 
        isOpen={isColorPickerOpen} 
        onClose={() => setIsColorPickerOpen(false)} 
        onSelect={handleAddColor} 
      />

      <NewCanvasModal 
        isOpen={isNewCanvasModalOpen} 
        onClose={() => setIsNewCanvasModalOpen(false)} 
        onCreate={handleCreateNewCanvas} 
      />

      <SavedProjectsModal 
        isOpen={isSavedProjectsOpen}
        onClose={() => setIsSavedProjectsOpen(false)}
        projects={savedProjects}
        onLoad={handleLoadProject}
        onDelete={handleDelete}
      />
      
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-primary/10 shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="size-10 flex items-center justify-center hover:bg-slate-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Grid3X3 size={20} />
          </div>
          <div>
            <input 
              type="text" 
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="text-base font-bold leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 w-40"
            />
            <p className="text-xs text-slate-500">{gridSize.width}x{gridSize.height} 画布 • 经典拼豆</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Download size={18} />
            <span>导出</span>
          </button>
          <button 
            onClick={handleSave}
            className="bg-primary text-white px-5 py-1.5 rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:scale-105 transition-transform"
          >
            保存项目
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-16 flex flex-col items-center py-4 gap-4 bg-white border-r border-primary/10">
          <button 
            onClick={() => setIsNewCanvasModalOpen(true)}
            className="size-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30"
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={() => setActiveTool('brush')}
            className={`size-10 flex items-center justify-center rounded-xl transition-all ${activeTool === 'brush' ? 'bg-primary/10 text-primary ring-2 ring-primary/20' : 'text-slate-400 hover:bg-slate-100'}`}
            title="画笔"
          >
            <Edit size={20} />
          </button>
          <button 
            onClick={() => setActiveTool('eraser')}
            className={`size-10 flex items-center justify-center rounded-xl transition-all ${activeTool === 'eraser' ? 'bg-primary/10 text-primary ring-2 ring-primary/20' : 'text-slate-400 hover:bg-slate-100'}`}
            title="橡皮擦"
          >
            <Eraser size={20} />
          </button>
          <button 
            onClick={() => setActiveTool('picker')}
            className={`size-10 flex items-center justify-center rounded-xl transition-all ${activeTool === 'picker' ? 'bg-primary/10 text-primary ring-2 ring-primary/20' : 'text-slate-400 hover:bg-slate-100'}`}
            title="吸色器"
          >
            <Pipette size={20} />
          </button>
          <div className="w-8 h-[1px] bg-slate-200 my-1"></div>
          <button 
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={`size-10 flex items-center justify-center rounded-xl transition-colors ${historyIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className={`size-10 flex items-center justify-center rounded-xl transition-colors ${historyIndex === history.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <RotateCw size={20} />
          </button>
          <div className="w-8 h-[1px] bg-slate-200 my-1"></div>
          <button 
            onClick={() => setIsSavedProjectsOpen(true)}
            className="size-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
            title="图层/我的作品"
          >
            <Layers size={20} />
          </button>
          <div className="mt-auto flex flex-col gap-4">
            <button className="size-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
              <Settings size={20} />
            </button>
          </div>
        </aside>

        <main className="flex-1 relative overflow-auto bg-slate-100 flex items-center justify-center p-8">
          <div 
            className="relative bg-white p-0 shadow-2xl border border-slate-300 rounded-sm overflow-hidden"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${gridSize.width}, 24px)`, 
              gridTemplateRows: `repeat(${gridSize.height}, 24px)`,
              width: 'fit-content',
              height: 'fit-content',
              transform: `scale(${zoom / 100})`
            }}
          >
            {grid.map((color, i) => (
              <div 
                key={i}
                onClick={() => handleCellClick(i)}
                className={`w-6 h-6 border border-slate-100 hover:border-primary transition-colors ${
                  activeTool === 'eraser' ? 'cursor-not-allowed' : 
                  activeTool === 'picker' ? 'cursor-copy' : 
                  'cursor-crosshair'
                }`}
                style={{ backgroundColor: color || 'transparent' }}
              />
            ))}
            
            <div className="absolute bottom-4 right-4 flex bg-white/90 backdrop-blur border border-slate-200 rounded-full px-2 py-1 shadow-lg gap-2">
              <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100">
                <Minus size={14} />
              </button>
              <span className="text-xs font-bold self-center px-1">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(400, z + 10))} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-primary/10 px-4 py-3 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {palette.map((color) => (
              <button 
                key={color.id}
                onClick={() => setSelectedColor(color.hex)}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div 
                  className={`size-11 rounded-md border-2 transition-all active:scale-95 ${selectedColor === color.hex ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary/50'}`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className={`text-[10px] font-bold ${selectedColor === color.hex ? 'text-primary' : 'text-slate-500'}`}>
                  {color.id}
                </span>
              </button>
            ))}
            <button 
              onClick={() => setIsColorPickerOpen(true)}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <div className="size-11 rounded-md border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors">
                <Plus size={20} />
              </div>
              <span className="text-[10px] font-medium text-slate-400">添加</span>
            </button>
          </div>
        </div>
      </footer>

      <div className="hidden lg:block fixed left-4 bottom-24 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-primary/10 shadow-xl">
        <div className="p-2 bg-primary/10 rounded-xl text-primary flex items-center gap-3">
          <ShoppingCart size={16} />
          <span className="text-xs font-bold">总像素: {grid.filter(c => c !== null).length}</span>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const api = React.useMemo(() => createApiClient(() => authToken), [authToken]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'PixelMaster',
    gender: 'Male',
    avatar: 'https://picsum.photos/seed/pixelmaster/200/200',
    bio: '拼豆艺术爱好者 | 已创作 100+ 图纸',
  });
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [likedPatternIds, setLikedPatternIds] = useState<string[]>([]);
  const [followedAuthors, setFollowedAuthors] = useState<string[]>([]);

  // Auth bootstrap (anonymous) + load user data from backend
  useEffect(() => {
    let cancelled = false;

    async function ensureAuth() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.access_token) {
        if (!cancelled) setAuthToken(sessionData.session.access_token);
        return;
      }
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      if (!cancelled) setAuthToken(data.session?.access_token ?? null);
    }

    ensureAuth().catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      if (!cancelled) alert(`登录失败：${e?.message ?? e}`);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthToken(session?.access_token ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!authToken) return;

    async function loadAll() {
      const [profileRes, projectsRes, likesRes, followingRes] = await Promise.all([
        api.get<{ profile: UserProfile | null }>('/api/profile'),
        api.get<{ projects: SavedProject[] }>('/api/projects'),
        api.get<{ likedPatternIds: string[] }>('/api/likes'),
        api.get<{ followedAuthors: string[] }>('/api/following'),
      ]);

      if (cancelled) return;

      if (profileRes.profile) setUserProfile(profileRes.profile);
      setSavedProjects(projectsRes.projects ?? []);
      setLikedPatternIds(likesRes.likedPatternIds ?? []);
      setFollowedAuthors(followingRes.followedAuthors ?? []);
    }

    loadAll().catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      if (!cancelled) alert(`数据加载失败：${e?.message ?? e}`);
    });

    return () => {
      cancelled = true;
    };
  }, [authToken, api]);

  const handleToggleLike = async (id: string) => {
    // optimistic UI
    const wasLiked = likedPatternIds.includes(id);
    setLikedPatternIds((prev) => (wasLiked ? prev.filter((pId) => pId !== id) : [...prev, id]));

    try {
      await api.post<{ liked: boolean }>('/api/likes/toggle', { patternId: id });
    } catch (e: any) {
      // rollback
      setLikedPatternIds((prev) => (wasLiked ? [...prev, id] : prev.filter((pId) => pId !== id)));
      alert(`点赞失败：${e?.message ?? e}`);
    }
  };

  const handleToggleFollow = async (authorName: string) => {
    const wasFollowing = followedAuthors.includes(authorName);
    setFollowedAuthors((prev) => (wasFollowing ? prev.filter((n) => n !== authorName) : [...prev, authorName]));

    try {
      await api.post<{ following: boolean }>('/api/following/toggle', { authorName });
    } catch (e: any) {
      setFollowedAuthors((prev) => (wasFollowing ? [...prev, authorName] : prev.filter((n) => n !== authorName)));
      alert(`关注失败：${e?.message ?? e}`);
    }
  };

  const handleSaveProject = async (projectData: Omit<SavedProject, 'updatedAt'>) => {
    const newProject: SavedProject = {
      ...projectData,
      updatedAt: Date.now()
    };
    
    // optimistic
    setSavedProjects((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === newProject.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = newProject;
        return next;
      }
      return [newProject, ...prev];
    });

    try {
      await api.put<{ ok: true }>(`/api/projects/${newProject.id}`, {
        id: newProject.id,
        title: newProject.title,
        width: newProject.width,
        height: newProject.height,
        grid: newProject.grid,
      });
    } catch (e: any) {
      alert(`保存失败：${e?.message ?? e}`);
      // refresh from server on failure
      try {
        const projectsRes = await api.get<{ projects: SavedProject[] }>('/api/projects');
        setSavedProjects(projectsRes.projects ?? []);
      } catch {
        // ignore
      }
    }
  };

  const handleDeleteProjects = async (ids: string[]) => {
    const prev = savedProjects;
    setSavedProjects((cur) => cur.filter((p) => !ids.includes(p.id)));

    try {
      await api.del<{ ok: true }>('/api/projects', { ids });
    } catch (e: any) {
      setSavedProjects(prev);
      alert(`删除失败：${e?.message ?? e}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onSelectPattern={setSelectedPattern} 
            likedPatternIds={likedPatternIds}
            onToggleLike={handleToggleLike}
            followedAuthors={followedAuthors}
          />
        );
      case 'explore':
        return <div className="flex items-center justify-center h-screen text-slate-400">探索页面开发中...</div>;
      case 'studio':
        return (
          <EditorPage 
            onBack={() => setActiveTab('home')} 
            onSave={handleSaveProject}
            onDeleteProject={handleDeleteProjects}
            savedProjects={savedProjects}
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            onBack={() => setActiveTab('home')} 
            profile={userProfile}
            onUpdateProfile={async (p) => {
              setUserProfile(p);
              try {
                await api.put<{ ok: true }>('/api/profile', p);
              } catch (e: any) {
                alert(`更新资料失败：${e?.message ?? e}`);
              }
            }}
            onSelectPattern={setSelectedPattern}
            likedPatternIds={likedPatternIds}
            onToggleLike={handleToggleLike}
            followedAuthors={followedAuthors}
            onToggleFollow={handleToggleFollow}
          />
        );
      default:
        return (
          <HomePage 
            onSelectPattern={setSelectedPattern} 
            likedPatternIds={likedPatternIds}
            onToggleLike={handleToggleLike}
            followedAuthors={followedAuthors}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedPattern && (
          <PatternDetailPage 
            pattern={selectedPattern} 
            onBack={() => setSelectedPattern(null)} 
            isLiked={likedPatternIds.includes(selectedPattern.id)}
            onToggleLike={handleToggleLike}
            isFollowing={followedAuthors.includes(selectedPattern.author)}
            onToggleFollow={handleToggleFollow}
          />
        )}
      </AnimatePresence>

      {activeTab !== 'studio' && !selectedPattern && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
