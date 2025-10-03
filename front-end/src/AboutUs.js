import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5002/about-us');
        console.log('[AboutUs] status', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProfile(data.profile);
      } catch (e) {
        setErr(`Failed to load profile: ${e.message}`);
      }
    })();
  }, []);

  if (err) {
    return (
      <article className="about-us-article">
        <h2>About Us
        </h2>
        <p>{err}</p>
      </article>
    );
  }

  if (!profile) {
    return (
      <article className="about-us-article">
        <h2>About Us</h2>
        <p>Loading…</p>
      </article>
    );
  }

  const bio = profile.bio;
  const photo = profile.photo

  return (
    <article className="about-us-article">
      <p>{bio}</p>
      <img className="muyao-photo" src={photo}></img>
    </article>
  );
};

export default AboutUs;