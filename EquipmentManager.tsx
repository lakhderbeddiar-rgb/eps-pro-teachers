import React, { useState } from 'react';
import { Plus, Printer, Edit2, Trash2, AlertCircle, CheckCircle2, Box } from 'lucide-react';
import { SportsEquipment } from '../types';

interface EquipmentManagerProps {
  equipment: SportsEquipment[];
  onUpdateEquipment: (equip: SportsEquipment[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const EquipmentManager: React.FC<EquipmentManagerProps> = ({
  equipment,
  onUpdateEquipment,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SportsEquipment | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SportsEquipment['category']>('balls');
  const [quantity, setQuantity] = useState(10);
  const [goodCondition, setGoodCondition] = useState(8);
  const [needsRepair, setNeedsRepair] = useState(2);
  const [storageLocation, setStorageLocation] = useState('خزانة العتاد رقم 1');
  const [notes, setNotes] = useState('');

  const handleEditClick = (item: SportsEquipment) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setGoodCondition(item.goodCondition);
    setNeedsRepair(item.needsRepair);
    setStorageLocation(item.storageLocation);
    setNotes(item.notes || '');
    setShowAddModal(true);
  };

  const handleCreateNewClick = () => {
    setEditingItem(null);
    setName('');
    setCategory('balls');
    setQuantity(10);
    setGoodCondition(10);
    setNeedsRepair(0);
    setStorageLocation('مستودع التربية البدنية');
    setNotes('');
    setShowAddModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updated = equipment.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              name,
              category,
              quantity: Number(quantity),
              goodCondition: Number(goodCondition),
              needsRepair: Number(needsRepair),
              storageLocation,
              notes,
            }
          : i
      );
      onUpdateEquipment(updated);
    } else {
      const newItem: SportsEquipment = {
        id: `eq-${Date.now()}`,
        name,
        category,
        quantity: Number(quantity),
        goodCondition: Number(goodCondition),
        needsRepair: Number(needsRepair),
        storageLocation,
        notes,
      };
      onUpdateEquipment([...equipment, newItem]);
    }
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العتاد؟')) return;
    onUpdateEquipment(equipment.filter((i) => i.id !== id));
  };

  const totalItems = equipment.reduce((acc, i) => acc + i.quantity, 0);
  const totalRepair = equipment.reduce((acc, i) => acc + i.needsRepair, 0);

  return (
    <div className="space-y-6">
      {/* Official Print Header */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
        <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية</p>
        <div className="flex justify-between items-center text-xs mt-3 px-2">
          <span>المؤسسة: {schoolName}</span>
          <span>الموسم الدراسي: {academicYear}</span>
          <span>{teacherName}</span>
        </div>
        <h1 className="text-xl font-black mt-4 underline">
          بطاقة جرد العتاد والوسائل البيداغوجية لمادة التربية البدنية والرياضية
        </h1>
      </div>

      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              سجل العتاد والوسائل البيداغوجية (Equipment & Inventory)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              جرد الكرات، الأقماع، البساط، وأدوات القياس مع متابعة الحالة الفنية وتنبيهات الصيانة.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateNewClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عتاد جديد</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كشف الجرد</span>
            </button>
          </div>
        </div>

        {/* Quick Inventory KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">إجمالي أنواع العتاد:</span>
            <strong className="text-slate-900 font-bold text-base tabular-nums">
              {equipment.length} أصناف
            </strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">إجمالي القطع واللوازم:</span>
            <strong className="text-slate-900 font-bold text-base tabular-nums">
              {totalItems} قطعة
            </strong>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="text-emerald-800 block">صالحة للاستعمال:</span>
            <strong className="text-emerald-950 font-bold text-base tabular-nums">
              {totalItems - totalRepair} قطعة
            </strong>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <span className="text-amber-800 block">تحتاج صيانة / تجديد:</span>
            <strong className="text-amber-950 font-bold text-base tabular-nums">
              {totalRepair} قطعة
            </strong>
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 w-12 text-center">الرقم</th>
              <th className="py-3 px-4">اسم الأداة أو العتاد</th>
              <th className="py-3 px-3 w-28">الصنف</th>
              <th className="py-3 px-3 text-center w-20">العدد الكلي</th>
              <th className="py-3 px-3 text-center w-20">حالة جيدة</th>
              <th className="py-3 px-3 text-center w-20">صيانة/إصلاح</th>
              <th className="py-3 px-4 w-40">مكان التخزين</th>
              <th className="py-3 px-4">ملاحظات فنية</th>
              <th className="py-3 px-3 w-20 text-center no-print">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipment.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-600">
                  {idx + 1}
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  {item.name}
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {item.category === 'balls' && 'كرات رياضية'}
                  {item.category === 'cones' && 'أقماع وشواخص'}
                  {item.category === 'gymnastics' && 'جمباز'}
                  {item.category === 'athletics' && 'ألعاب قوى'}
                  {item.category === 'measuring' && 'أدوات قياس'}
                  {item.category === 'other' && 'أخرى'}
                </td>
                <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-800">
                  {item.quantity}
                </td>
                <td className="py-3 px-3 text-center font-bold tabular-nums text-emerald-700">
                  {item.goodCondition}
                </td>
                <td className="py-3 px-3 text-center font-bold tabular-nums text-amber-700">
                  {item.needsRepair > 0 ? item.needsRepair : '0'}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {item.storageLocation}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {item.notes || '—'}
                </td>
                <td className="py-3 px-3 text-center no-print">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-1 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                      title="تعديل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Official Signatures for Print */}
      <div className="hidden print:grid grid-cols-2 gap-12 text-center text-xs mt-12 pt-8 border-t border-slate-300">
        <div>
          <p className="font-bold">أستاذ التربية البدنية والرياضية المسؤول</p>
          <div className="h-16"></div>
          <p className="text-slate-600">{teacherName}</p>
        </div>
        <div>
          <p className="font-bold">تأشيرة المقتصد / مدير المؤسسة</p>
          <div className="h-16"></div>
          <p className="text-slate-600">المؤسسة: {schoolName}</p>
        </div>
      </div>

      {/* Modal: Add/Edit Equipment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingItem ? 'تعديل بيانات العتاد' : 'إضافة عتاد رياضي جديد'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم الأداة أو العتاد</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كرات يد قياس رقم 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الصنف</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="balls">كرات رياضية</option>
                  <option value="cones">أقماع وشواخص</option>
                  <option value="gymnastics">جمباز وبساط</option>
                  <option value="athletics">ألعاب قوى</option>
                  <option value="measuring">أدوات قياس وميقاتيات</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الكمية الكلية</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">حالة جيدة</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={goodCondition}
                    onChange={(e) => setGoodCondition(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">صيانة/إصلاح</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={needsRepair}
                    onChange={(e) => setNeedsRepair(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">مكان التخزين</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خزانة الكرات رقم 1"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ملاحظات فنية</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات حول حالة العتاد أو النواقص..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  حفظ العتاد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
