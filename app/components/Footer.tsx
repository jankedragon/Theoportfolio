// app/components/Footer.tsx
"use client";

import { useState, useEffect } from 'react';
import { client } from '../lib/sanity'; // Adjust import path as needed

export default function Footer() {
  const [footerData, setFooterData] = useState({
    name: 'Fname Lname',
    location: 'City, State',
    phone: '999-999-9999',
    email: 'emailname@email.com',
    linkedinUrl: ''
  });

  useEffect(() => {
    // Fetch footer data from Sanity
    const fetchFooterData = async () => {
      try {
        const query = `*[_type == "footerSettings"][0]{
          name,
          location,
          phone,
          email,
          linkedinUrl
        }`;
        
        const data = await client.fetch(query);
        if (data) {
          setFooterData(data);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
        // Fallback to default values if fetch fails
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-name">{footerData.name}</div>
          <div className="footer-location">{footerData.location}</div>
          <div className="footer-phone">{footerData.phone}</div>
          <div className="footer-email">
            <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
          </div>
        </div>
        {footerData.linkedinUrl && (
          <div className="footer-linkedin">
            <a href={footerData.linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn Profile
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}