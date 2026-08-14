import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

const ALLOWED_AUDIO_TYPES = ['.wav', '.mp3', '.flac', '.aiff'];
const ALLOWED_IMAGE_TYPES = ['.png', '.jpg', '.jpeg', '.webp'];

export default function AddSongs({ onClose }: Props) {
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setAudioFile(null);
      return;
    }

    const fileName = file.name.toLowerCase();
    const isAllowed = ALLOWED_AUDIO_TYPES.some((type) => fileName.endsWith(type));

    if (!isAllowed) {
      alert('Please upload a WAV, MP3, FLAC, or AIFF file.');
      e.target.value = '';
      setAudioFile(null);
      return;
    }

    setAudioFile(file);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setImageFile(null);
      return;
    }

    const fileName = file.name.toLowerCase();
    const isAllowed = ALLOWED_IMAGE_TYPES.some((type) => fileName.endsWith(type));

    if (!isAllowed) {
      alert('Please upload a PNG, JPG, JPEG, or WEBP image.');
      e.target.value = '';
      setImageFile(null);
      return;
    }

    setImageFile(file);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!audioFile) {
      alert('Please select an audio file to upload.');
      return;
    }

    if (!imageFile) {
      alert('Please select a cover image to upload.');
      return;
    }

    console.log('Add song', {
      title,
      audioFile: audioFile.name,
      imageFile: imageFile.name,
    });

    setTitle('');
    setAudioFile(null);
    setImageFile(null);
    onClose();
  }

  return (
    <div className="add-songs-modal" role="dialog" aria-modal="true">
      <button className="rv-close" onClick={onClose} aria-label="close">✕</button>
      <h3 style={{ marginTop: 0 }}>Add Songs</h3>
      <form onSubmit={handleAdd} className="add-songs-form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song title" />
        </label>

        <label>
          Audio file
          <input
            type="file"
            accept=".wav,.mp3,.flac,.aiff,audio/wav,audio/mpeg,audio/flac,audio/aiff"
            onChange={handleAudioChange}
          />
        </label>

        <small style={{ display: 'block', marginTop: 4, color: '#666' }}>
          Supported audio formats: WAV, MP3, FLAC, AIFF
        </small>

        <label style={{ marginTop: 12 }}>
          Cover image
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
          />
        </label>

        <small style={{ display: 'block', marginTop: 4, color: '#666' }}>
          Supported image formats: PNG, JPG, JPEG, WEBP
        </small>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button type="submit" className="add-songs-submit">Add</button>
          <button type="button" onClick={onClose} className="add-songs-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
}
