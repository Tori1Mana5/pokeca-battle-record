'use client';

type MatchRecord = {
  id: string;
  date: string,
  opponent: string;
  myDeck: string;
  opponentDeck: string;
  mySides: number;
  opponentSides: number;
  result: 'win' | 'loss' | 'draw';
  memo: string;
};

import { Trophy, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Target, TrendingUp, User, Swords, Medal, Trash2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'record' | 'history'>('record');

  // 記録したデータを保管
  const [records, setRecords] = useState<MatchRecord[]>([]);

  // 保存されたデータを読み込む
  useEffect(() => {
    const saveData = localStorage.getItem('poke-match-results');
    if (saveData) {
      setRecords(JSON.parse(saveData));
    }
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('poke-match-results', JSON.stringify(records));
    }
  }, [records]);

  const addRecord = (newRecord: MatchRecord) => {
    // すでにある記録に新規の記録を追加
    setRecords([newRecord, ...records]);

    // 保存したら対戦履歴タブを表示する
    setActiveTab('history');
  };

    const deleteRecord = (id: string) => {
    if (confirm('この記録を削除してもいいですか？')) {
      const updateRecords = records.filter(r => r.id !== id);
      setRecords(updateRecords);

      // データがからになった時のためにlocalStorageを更新
      localStorage.setItem('poke-match-results', JSON.stringify(updateRecords));
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 p-4'>
      <div className='text-center mt-8 mb-8'>
        <div className='flex justify-center items-center gap-2 mb-2'>
          <Trophy className='text-yellow-500' size={28} />
          <h1 className='text-purple-600 font-bold text-xl'>ポケモンカード対戦記録</h1>
        </div>
      </div>

      <div className='max-w-2xl mx-auto flex bg-white rounded-lg transition-all mb-8 shadow-sm p-1'>
        <button 
          onClick={() => setActiveTab('record')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
            activeTab === 'record' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          対戦を記録
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
            activeTab === 'history' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          対戦履歴
        </button>
      </div>
      {/* 動作確認用のテキスト */}
      <div className='max-w-2xl mx-auto'>
        {activeTab === 'record' && (
          <RecordForm onSave={addRecord} />
        )}

        {activeTab === 'history' && (
          <HistoryView records={records} onDelete={deleteRecord} />
        )}
      </div>
    </div>
  );
}

function HistoryView({ records, onDelete } : {records: MatchRecord[], onDelete: (id: string) => void }) {

  // 戦績の計算
  const totalMatches = records.length;
  const wins = records.filter(r => r.result === 'win').length;
  const loses = totalMatches - wins;
  const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0.0';

  // データが一つもない時の表示
  if (records.length === 0) {
    return (
      <div className='bg-white rounded-xl p-12 flex flex-col items-center justify-center shadow-sm'>
        <Trophy className='text-gray-200 mb-4' size={64} />
        <p className='text-gray-400 font-bold'>まだ対戦記録がありません</p>
        <p className='text-gray-300 text-sm'>対戦記録から追加してみましょう！</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-3 gap-4'>
        <SummaryCard icon={<Target className='text-purple-500 ' />} label='総試合数' value={`${totalMatches}試合`} color='border-purple-400 shadow-purple-100' />
        <SummaryCard icon={<Trophy className='text- green-500 ' />} label='戦績' value={`${wins}勝 ${loses}敗`} color='border-green-400 shadow-green-100' />
        <SummaryCard icon={<TrendingUp className='text-blue-500 ' />} label='勝率' value={`${winRate}`} color='border-blue-400 shadow-blue-100' />
      </div>

      {records.map((record) => (
        <div key={record.id} className={`rounded-xl p-4 border relative ${
          record.result === 'win' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'
        }`}>
          <div className='flex flex-col items-center mb-6'>
            <span className={`text-xl font-black px-8 py-2 rounded-full shadow-sm ${
              record.result === 'win' 
                ? 'text-green-600 bg-white border border-green-200'
                : 'text-red-600 bg-white border border-red-200'
              }`}>
              {record.result === 'win' ? '勝利' : '敗北'}
            </span>
            <div className='flex items-center gap-1 text-gray-400 text-xs mt-3'>
              <Calendar size={14} />
              <span>{record.date}</span>
            </div>
          </div>

          {/* 対戦詳細情報 */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 text-gray-500 text-sm'>
              <User size={16} />
              <span>{record.opponent || '対戦相手不明'}</span>
            </div>

            <div className='grid grid-cols-2 gap-8 text-sm px-2'>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <User size={16} />
                <span>{record.myDeck}</span>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-400 mb-1">
                  相手のデッキ
                </div>
                <div className="font-bold text-gray-700">{record.opponentDeck}</div>
              </div>
            </div>

            {/* サイド数の白いボックス */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-4">
              <Medal className="text-yellow-500" size={16} />
              <span className="text-gray-400 text-xs font-bold">取得サイド数</span>
              <div className="flex-1 flex justify-around text-center">
                <div>
                  <div className="text-[10px] text-gray-400">自分</div>
                  <div className="text-purple-600 font-bold">{record.mySides}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400">相手</div>
                  <div className="font-bold">{record.opponentSides}</div>
                </div>
              </div>
            </div>

            {/* メモ */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-[10px] text-gray-400 mb-1">メモ</div>
              <div className="text-sm text-gray-700">{record.memo}</div>
            </div>
          </div>
          {/* 削除ボタン */}
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => onDelete(record.id)}
              className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs transition-colors"
            >
              <Trash2 size={14} /> 削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className={`bg-white border-2 rounded-xl p-3 flex items-center gap-3 shadow-sm ${color}`}>
      <div className='bg-gray-50 p-2 rounded-lg'>
        {icon}
      </div>
      <div>
        <div className='text-[10px] text-gray-400 font-bold'>{label}</div>
        <div className='text-xs font-black text-gray-700'>{value}</div>
      </div>
    </div>
  );
}

function RecordForm({ onSave }: { onSave: (record: MatchRecord) => void }) {
  const today = new Date().toISOString().split('T')[0];

  const [result, setResult] = useState<'win' | 'loss' | null>(null);

  const [formData, setFormData] = useState({
    date: today,
    opponent: '',
    myDeck: '',
    opponentDeck: '',
    mySides: 0,
    opponentSides: 0,
    memo: ''
  });

  const handleSave = () => {
    if (!result) {
      alert('試合結果を選択してください');
      return;
    }
    
    // 新しい記録のデータを作成
    const newRecord: MatchRecord = {
      id: Math.random().toString(36).substring(7),
      ...formData,
      result: result,
    };

    onSave(newRecord);
  };


  return (
    <div className='bg-white rounded-xl p-6 shadow-sm space-y-6'>
      {/* 日付と対戦相手 */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-bold mb-1 text-gray-700'>日付</label>
          <input 
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className='w-full bg-gray-100 p-2 rounded-lg border-none text-sm outline-purple-400'
          />
        </div>
        <div>
          <label className='block text-sm font-bold mb-1 text-gray-700'>対戦相手(任意)</label>
          <input 
            type='text'
            placeholder='例：トレーナーA'
            value={formData.opponent}
            onChange={(e) => setFormData({...formData, opponent: e.target.value})}
            className='w-full bg-gray-100 p-2 rounded-lg border-none text-sm outline-purple-400'
          />
        </div>
      </div>
      {/* 自分のデッキと相手のデッキ */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-bold mb-1 text-gray-700'>自分のデッキ</label>
          <input 
            type='text'
            placeholder='例：ミュウツーex'
            value={formData.myDeck}
            onChange={(e) => setFormData({...formData, myDeck: e.target.value})}
            className='w-full bg-gray-100 p-2 rounded-lg border-none text-sm outline-purple-400' />
        </div>
        <div>
          <label className='block text-sm font-bold mb-1 text-gray-700'>相手のデッキ</label>
          <input 
            type='text'
            placeholder='例：リザードンex'
            value={formData.opponentDeck}
            onChange={(e) => setFormData({...formData, opponentDeck: e.target.value})}
            className='w-full bg-gray-100 p-2 rounded-lg border-none text-sm outline-purple-400' />
        </div>
      </div>
      {/* 取ったサイド数 */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-bold mb-1 text-gray-700'>自分が取ったサイドの数</label>
          <input 
            type='number' 
            min='0'
            max='6'
            value={formData.mySides}
            onChange={(e) => setFormData({...formData, mySides: Number(e.target.value)})}
            className='w-full bg-gray-100 p-2 rounded-none text-sm outline-purple-400' />
        </div>
        <div>
          <label className='block text-sm font-bold mb-1 text-gray-700'>相手が取ったサイドの数</label>
          <input
            type='number' 
            min='0'
            max='6'
            value={formData.opponentSides}
            onChange={(e) => setFormData({...formData, opponentSides: Number(e.target.value)})}
            className='w-full bg-gray-100 p-2 rounded-none text-sm outline-purple-400' />
        </div>
      </div>
      {/* 試合結果 */}
      <div>
        <label className='block text-sm font-bold mb-3 text-gray-700'>試合結果</label>
        <div className='grid grid-cols-2 gap-3 item'>
          <button 
            type='button'
            onClick={() => setResult('win')}
            className={`py-3 font-bold rounded-xl text-sm transition-all border-2 ${
              result === 'win' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            勝ち
          </button>
          <button 
            type='button'
            onClick={() => setResult('loss')}
            className={`py-3 font-bold rounded-xl text-sm transition-all border-2 ${
              result === 'loss' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            負け
          </button>
        </div>
      </div>
      {/* メモ */}
      <div>
        <label className='block text-sm font-bold mb-1 text-gray-700'>メモ(任意)</label>
        <textarea 
          placeholder="対戦の詳細やメモを記入..."
          value={formData.memo}
          onChange={(e) => setFormData({...formData, memo: e.target.value})}
          className="w-full bg-gray-100 p-3 rounded-xl border-none h-24 text-sm"
        />
      </div>
      {/* 保存ボタン */}
      <button 
        onClick={handleSave}
        className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-md shadow-purple-100"
      >
        記録を保存
      </button>
    </div>
  );
}