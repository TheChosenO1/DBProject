import React from 'react';
import { useParams } from 'react-router-dom';
import './ArtReviewPage.css';

const ArtReviewPage = () => {
    console.log('ArtReviewPage');
    const { artId } = useParams();

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
