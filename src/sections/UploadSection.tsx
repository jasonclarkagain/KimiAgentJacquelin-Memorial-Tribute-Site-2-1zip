import { useRef, useState, useEffect, useCallback } from 'react';
import { Upload, Download, Image, Video, FileText, X, Archive, Bell, BellOff } from 'lucide-react';
import JSZip from 'jszip';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'text';
  filename?: string;
  originalName?: string;
  url?: string;
  content?: string;
  uploader: string;
  caption: string;
  uploadedAt: string;
  size?: number;
}

interface UploadSectionProps {
  className?: string;
}

export default function UploadSection({ className = '' }: UploadSectionProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [textContent, setTextContent] = useState('');
  const [activeTab, setActiveTab] = useState<'photo-video' | 'text'>('photo-video');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [zipping, setZipping] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'done' | 'already' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) setMedia(await res.json());
    } catch {}
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    setSelectedFiles(prev => [...prev, ...arr]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeSelected = (i: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const submitFiles = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    setUploadProgress(`Uploading ${selectedFiles.length} file(s)...`);
    const form = new FormData();
    selectedFiles.forEach(f => form.append('files', f));
    form.append('uploader', uploaderName || 'Anonymous');
    form.append('caption', caption);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (res.ok) {
        setSelectedFiles([]);
        setCaption('');
        setUploadProgress('Uploaded successfully!');
        await fetchMedia();
        setTimeout(() => setUploadProgress(''), 3000);
      }
    } catch {
      setUploadProgress('Upload failed. Please try again.');
    }
    setUploading(false);
  };

  const submitText = async () => {
    if (!textContent.trim()) return;
    setUploading(true);
    try {
      const res = await fetch('/api/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploader: uploaderName || 'Anonymous', content: textContent, caption }),
      });
      if (res.ok) {
        setTextContent('');
        setCaption('');
        await fetchMedia();
      }
    } catch {}
    setUploading(false);
  };

  const downloadItem = async (item: MediaItem) => {
    if (!item.url) return;
    const res = await fetch(item.url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = item.originalName || item.filename || 'file';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadAll = async () => {
    const downloadable = media.filter(m => m.url);
    if (!downloadable.length) return;
    setZipping(true);
    const zip = new JSZip();
    const folder = zip.folder('Jackie_Hellenberg_Memories')!;
    await Promise.all(downloadable.map(async item => {
      try {
        const res = await fetch(item.url!);
        const blob = await res.blob();
        folder.file(item.originalName || item.filename || item.id, blob);
      } catch {}
    }));
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'Jackie_Hellenberg_Memories.zip';
    a.click();
    URL.revokeObjectURL(a.href);
    setZipping(false);
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail.trim(), name: subName.trim() }),
      });
      const data = await res.json();
      if (data.already) setSubStatus('already');
      else if (data.success) setSubStatus('done');
      else setSubStatus('error');
    } catch {
      setSubStatus('error');
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const imageMedia = media.filter(m => m.type === 'image');
  const videoMedia = media.filter(m => m.type === 'video');
  const textMedia = media.filter(m => m.type === 'text');

  return (
    <section
      id="share"
      className={`relative bg-white pt-14 pb-20 lg:pt-16 lg:pb-28 ${className}`}
    >
      {/* Gradient bridge from MemorySection */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#F8F7F4] to-white pointer-events-none z-0" />

      <div className="relative z-10 px-8 lg:px-16 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="label-mono text-[rgba(26,26,26,0.72)] mb-4">Share With Everyone</p>
          <h2 className="title-section text-[#1A1A1A] mb-4">Add Your Memories</h2>
          <p className="body-text text-[rgba(26,26,26,0.8)] max-w-xl">
            Upload photos, videos, or write a memory. Everything shared here 
            becomes part of Jackie's story — and can always be downloaded by anyone who visits.
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-[#F8F7F4] p-8 lg:p-12 mb-20">

          {/* Name field */}
          <div className="mb-6">
            <label className="label-mono text-[rgba(26,26,26,0.8)] block mb-2">Your Name</label>
            <input
              type="text"
              value={uploaderName}
              onChange={e => setUploaderName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full max-w-sm px-4 py-3 bg-white border border-black/15 text-[#1A1A1A] placeholder:text-black/30 focus:outline-none focus:border-[#C47A1E] transition-colors"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-black/10">
            <button
              onClick={() => setActiveTab('photo-video')}
              className={`flex items-center gap-2 px-5 py-3 label-mono transition-colors ${
                activeTab === 'photo-video'
                  ? 'text-[#C47A1E] border-b-2 border-[#C47A1E] -mb-px'
                  : 'text-[rgba(26,26,26,0.72)] hover:text-[#1A1A1A]'
              }`}
            >
              <Image className="w-4 h-4" /> Photos & Videos
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-5 py-3 label-mono transition-colors ${
                activeTab === 'text'
                  ? 'text-[#C47A1E] border-b-2 border-[#C47A1E] -mb-px'
                  : 'text-[rgba(26,26,26,0.72)] hover:text-[#1A1A1A]'
              }`}
            >
              <FileText className="w-4 h-4" /> Write a Memory
            </button>
          </div>

          {activeTab === 'photo-video' ? (
            <div className="space-y-6">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-sm p-12 text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-[#C47A1E] bg-[#C47A1E]/5'
                    : 'border-black/20 hover:border-[#C47A1E]/60 hover:bg-[#C47A1E]/3'
                }`}
              >
                <Upload className="w-8 h-8 text-[rgba(26,26,26,0.55)] mx-auto mb-3" />
                <p className="body-text text-[#1A1A1A] mb-1">
                  Drop photos or videos here, or <span className="text-[#C47A1E] underline">browse</span>
                </p>
                <p className="label-mono text-[rgba(26,26,26,0.65)]">JPG, PNG, GIF, MP4, MOV — up to 500MB each</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />

              {/* Selected files preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="label-mono text-[rgba(26,26,26,0.72)]">{selectedFiles.length} file(s) ready</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {selectedFiles.map((f, i) => (
                      <div key={i} className="relative group aspect-square bg-white border border-black/10 overflow-hidden">
                        {f.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(f)}
                            alt={f.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <Video className="w-6 h-6 text-[rgba(26,26,26,0.65)]" />
                            <span className="text-[10px] text-[rgba(26,26,26,0.72)] px-2 text-center truncate w-full">{f.name}</span>
                          </div>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); removeSelected(i); }}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Caption */}
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Add a caption (optional)"
                className="w-full px-4 py-3 bg-white border border-black/15 text-[#1A1A1A] placeholder:text-black/30 focus:outline-none focus:border-[#C47A1E] transition-colors"
              />

              <div className="flex items-center gap-4">
                <button
                  onClick={submitFiles}
                  disabled={uploading || !selectedFiles.length}
                  className="flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] hover:bg-[#C47A1E] disabled:opacity-40 disabled:cursor-not-allowed text-white label-mono transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                {uploadProgress && (
                  <span className="label-mono text-[rgba(26,26,26,0.8)]">{uploadProgress}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <textarea
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
                placeholder="Share a memory about Jackie..."
                rows={6}
                className="w-full px-4 py-3 bg-white border border-black/15 text-[#1A1A1A] placeholder:text-black/30 focus:outline-none focus:border-[#C47A1E] transition-colors resize-none"
              />
              <button
                onClick={submitText}
                disabled={uploading || !textContent.trim()}
                className="flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] hover:bg-[#C47A1E] disabled:opacity-40 disabled:cursor-not-allowed text-white label-mono transition-colors"
              >
                <FileText className="w-4 h-4" />
                {uploading ? 'Saving...' : 'Share Memory'}
              </button>
            </div>
          )}
        </div>

        {/* Shared media display */}
        {media.length > 0 && (
          <div>
            {/* Download all */}
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-serif text-2xl text-[#1A1A1A]">
                Shared Memories ({media.length})
              </h3>
              {(imageMedia.length > 0 || videoMedia.length > 0) && (
                <button
                  onClick={downloadAll}
                  disabled={zipping}
                  className="flex items-center gap-2 px-6 py-2.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] label-mono transition-colors disabled:opacity-50"
                >
                  <Archive className="w-4 h-4" />
                  {zipping ? 'Preparing...' : 'Download All'}
                </button>
              )}
            </div>

            {/* Images */}
            {imageMedia.length > 0 && (
              <div className="mb-16">
                <p className="label-mono text-[rgba(26,26,26,0.72)] mb-6">Photos ({imageMedia.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {imageMedia.map(item => (
                    <div key={item.id} className="group relative aspect-square overflow-hidden bg-[#F8F7F4]">
                      <img
                        src={item.url}
                        alt={item.caption || 'Shared photo'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                        <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          {item.caption && (
                            <p className="text-white text-xs mb-1 truncate">{item.caption}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 text-[10px]">{item.uploader} · {formatDate(item.uploadedAt)}</span>
                            <button
                              onClick={() => downloadItem(item)}
                              className="flex items-center gap-1 text-white hover:text-[#FFE87A] transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videoMedia.length > 0 && (
              <div className="mb-16">
                <p className="label-mono text-[rgba(26,26,26,0.72)] mb-6">Videos ({videoMedia.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videoMedia.map(item => (
                    <div key={item.id} className="group relative bg-black rounded-sm overflow-hidden">
                      <video
                        src={item.url}
                        controls
                        className="w-full aspect-video object-contain"
                        preload="metadata"
                      />
                      <div className="p-4 bg-[#F8F7F4] flex items-center justify-between">
                        <div>
                          {item.caption && <p className="text-sm text-[#1A1A1A] mb-0.5">{item.caption}</p>}
                          <span className="label-mono text-[rgba(26,26,26,0.72)] text-[10px]">
                            {item.uploader} · {formatDate(item.uploadedAt)} · {formatSize(item.size)}
                          </span>
                        </div>
                        <button
                          onClick={() => downloadItem(item)}
                          className="flex items-center gap-1.5 px-4 py-2 border border-black/20 hover:border-[#C47A1E] hover:text-[#C47A1E] label-mono text-[#1A1A1A] transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text memories */}
            {textMedia.length > 0 && (
              <div>
                <p className="label-mono text-[rgba(26,26,26,0.72)] mb-6">Written Memories ({textMedia.length})</p>
                <div className="space-y-4">
                  {textMedia.map(item => (
                    <div key={item.id} className="p-6 bg-[#F8F7F4] border-l-4 border-[#C47A1E]/40">
                      <p className="body-text text-[#1A1A1A] leading-relaxed mb-4">"{item.content}"</p>
                      <p className="label-mono text-[rgba(26,26,26,0.65)]">
                        — {item.uploader} · {formatDate(item.uploadedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* Stay Updated */}
        <div className="mt-20 p-8 bg-[#F8F7F4] border border-black/8">
          <div className="flex items-start gap-4">
            <Bell className="w-5 h-5 text-[#C47A1E] mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Stay updated</h3>
              <p className="text-sm text-[rgba(26,26,26,0.8)] mb-5">
                Get an email whenever a new photo, video, or memory is added to this page.
              </p>

              {subStatus === 'done' && (
                <div className="flex items-center gap-2 text-sm text-[#C47A1E]">
                  <Bell className="w-4 h-4" />
                  You're subscribed. We'll let you know when something new is shared.
                </div>
              )}
              {subStatus === 'already' && (
                <div className="flex items-center gap-2 text-sm text-[rgba(26,26,26,0.75)]">
                  <BellOff className="w-4 h-4" />
                  You're already subscribed.
                </div>
              )}
              {subStatus === 'error' && (
                <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
              )}

              {(subStatus === 'idle' || subStatus === 'loading') && (
                <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={subName}
                    onChange={e => setSubName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="px-4 py-2.5 border border-black/15 text-sm text-[#1A1A1A] placeholder:text-black/30 focus:outline-none focus:border-[#C47A1E] transition-colors w-full sm:w-48"
                  />
                  <input
                    type="email"
                    value={subEmail}
                    onChange={e => setSubEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="px-4 py-2.5 border border-black/15 text-sm text-[#1A1A1A] placeholder:text-black/30 focus:outline-none focus:border-[#C47A1E] transition-colors flex-1"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="px-6 py-2.5 bg-[#C47A1E] hover:bg-[#A86018] text-white label-mono text-xs transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {subStatus === 'loading' ? 'Subscribing…' : 'Notify Me'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
