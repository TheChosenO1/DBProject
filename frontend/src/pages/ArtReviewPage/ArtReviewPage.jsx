import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import profileService from '../../services/profileService';
import './ArtReviewPage.css';
import { useAuth } from '../../context/AuthContext';

const ArtReviewPage = () => {
    const { user } = useAuth();
    const { artId } = useParams();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (user?.userid) {
              try {
                const data = await profileService.getProfile(user.userid);
                setProfileData(data);
              } catch (error) {
                console.error('Error fetching profile:', error);
              }
            }
          };
      
          fetchProfileData();
    }, [artId]);

    return (
        <div className="art-review-page">
            <h1>
                {artId 
                    ? `ArtReviewPage - Art ID: ${artId}`
                    : 'Art ID not given'
                }
            </h1>
        </div>
    );
};

export default ArtReviewPage;