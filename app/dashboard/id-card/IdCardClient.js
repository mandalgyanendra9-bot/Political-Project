'use client';
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import styles from './IdCard.module.css';

export default function IdCardClient({ user }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: null
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `PDP-ID-Card-${user.name.replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to download ID card', error);
      alert('Failed to download ID card. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Generate a mock membership ID
  const memberId = `PDP-${new Date(user.createdAt).getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`;

  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <div className={styles.idCard} ref={cardRef}>
          {/* Card Header */}
          <div className={styles.cardHeader}>
            <div className={styles.logoMark}>PDP</div>
            <div className={styles.headerText}>
              <div className={styles.partyName}>Progressive Democratic Party</div>
              <div className={styles.cardTitle}>Official Membership Card</div>
            </div>
          </div>
          
          {/* Card Body */}
          <div className={styles.cardBody}>
            <div className={styles.photoContainer}>
              {user.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} crossOrigin="anonymous" />
              ) : (
                <div className={styles.photoPlaceholder}>Photo</div>
              )}
            </div>
            
            <div className={styles.memberDetails}>
              <div className={styles.detailGroup}>
                <label>Name</label>
                <div className={styles.value}>{user.name}</div>
              </div>
              <div className={styles.detailGroup}>
                <label>Member ID</label>
                <div className={styles.value} style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px' }}>{memberId}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Joined</label>
                  <div className={styles.value}>{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
                <div className={styles.detailGroup}>
                  <label>Status</label>
                  <div className={styles.value} style={{ color: '#48bb78', fontWeight: 'bold' }}>{user.status}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Footer */}
          <div className={styles.cardFooter}>
            <div className={styles.signature}>Auth. Signature</div>
            <div className={styles.barcode}>
              {/* Mock Barcode using a narrow repeating gradient */}
              <div style={{ width: '100%', height: '30px', background: 'repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 5px, #fff 5px, #fff 8px, #000 8px, #000 12px, #fff 12px, #fff 14px)' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className="btn btn-primary"
          style={{ gap: '8px' }}
        >
          <Download size={20} />
          {downloading ? 'Generating...' : 'Download ID Card'}
        </button>
      </div>
    </div>
  );
}
