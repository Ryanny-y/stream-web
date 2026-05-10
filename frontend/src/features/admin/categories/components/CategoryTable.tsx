import React from 'react';
import {
  ArrowUpDown,
  CalendarClock,
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import type { AdminCategory, CategoryStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface CategoryTableProps {
  categories: AdminCategory[];
  onView: (category: AdminCategory) => void;
  onEdit: (category: AdminCategory) => void;
  onStatusChange: (category: AdminCategory, status: CategoryStatus) => void;
  onDelete: (category: AdminCategory) => void;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="hover:bg-transparent border-white/5">
            <TableHead>
              <span className="inline-flex items-center gap-2">
                Category Name <ArrowUpDown className="w-3 h-3 text-gray-600" />
              </span>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Videos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Created Date</TableHead>
            <TableHead className="hidden xl:table-cell">Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.categoryId} className="hover:bg-white/5 border-white/5 transition-colors">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-white">{category.categoryName}</span>
                  <span className="text-[11px] text-gray-500">ID #{category.categoryId}</span>
                </div>
              </TableCell>
              <TableCell>
                <p className="max-w-[360px] text-sm text-gray-400 line-clamp-2">{category.description}</p>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-semibold text-white">{category.videoCount}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={category.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <CalendarClock className="w-3 h-3" />
                  {formatDate(category.createdAt)}
                </span>
              </TableCell>
              <TableCell className="hidden xl:table-cell text-xs text-gray-500">
                {formatDate(category.updatedAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-white/10 text-white">
                    <DropdownMenuLabel>Category Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(category)} className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(category)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" /> Edit Category
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {category.status === 'ACTIVE' ? (
                      <DropdownMenuItem onClick={() => onStatusChange(category, 'HIDDEN')} className="cursor-pointer text-zinc-400">
                        <EyeOff className="mr-2 h-4 w-4" /> Hide
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onStatusChange(category, 'ACTIVE')} className="cursor-pointer text-emerald-500">
                        <RotateCcw className="mr-2 h-4 w-4" /> Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(category)}
                      className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
