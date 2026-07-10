import React from 'react';
import BottomMenu from '../components/bottomMenu';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div>
      <BottomMenu />
      <div style={{ paddingTop: 120, paddingBottom: 96, paddingLeft: 24, paddingRight: 24, maxWidth: 648, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <img
          src="/photo-of-me.webp"
          alt="photo of me"
          loading="lazy"
          decoding="async"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: 10, objectFit: 'cover' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--color-text)' }}>This is Usman!</div>
          <div style={{ fontSize: 16, color: 'var(--color-text)', lineHeight: 1.6 }}>
            I'm an Associate UX Designer at Intapp, with a Bachelor of Arts in
            Design, a Certificate in Computer Science, and a Minor in Arabic from the University of Texas at Austin.
            I believe that digital product design is a powerful tool for building community and taking care of others.
            It's a designer's responsibility to hear other's stories, and help them build equitable futures based on those
            stories. That's why I'm passionate about building in spaces like mental health and health care.
          </div>
        </div>
      </div>
    </div>
  );
}