import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import profileService from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import './ArtReviewPage.css';

const ArtReviewPage = () => {
  const { user } = useAuth();
  const { artId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personalReview, setPersonalReview] = useState(null);
  const [personalNote, setPersonalNote] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, review_text: '' });
  const [newNote, setNewNote] = useState({ note_text: '' });
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.userid) {
        try {
          const data = await profileService.getProfile(user.userid);
          setProfileData(data);
          
          // Set initial review and note
          const review = data.reviews.find(review => review.artworkid === artId);
          const note = data.notes.find(note => note.artworkid === artId);
          const favorite = data.favs.some(fav => fav.artworkid === artId);
          setPersonalReview(review);
          setPersonalNote(note);
          setIsFavorite(favorite);
          
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user?.userid, artId]);

  const handleDeleteReview = () => {
    setPersonalReview(null);
    // TODO: Add backend communication later
  };

  const handleDeleteNote = () => {
    setPersonalNote(null);
    // TODO: Add backend communication later
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: Date.now().toString(),
      artworkid: artId,
      rating: parseInt(newReview.rating),
      review_text: newReview.review_text,
      timestamp: new Date().toISOString()
    };
    setPersonalReview(review);
    setShowReviewForm(false);
    // TODO: Add backend communication later
  };

  const handleSubmitNote = (e) => {
    e.preventDefault();
    const note = {
      id: Date.now().toString(),
      artworkid: artId,
      note_text: newNote.note_text,
      timestamp: new Date().toISOString()
    };
    setPersonalNote(note);
    setShowNoteForm(false);
    // TODO: Add backend communication later
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Add backend communication later
  };

  if (!artId) {
    return (
      <div className="art-review-page">
        <div className="container">
          <h1>Art ID not given</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="art-review-page">
        <div className="container">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="art-review-page">
        <div className="container">
          <h1>No profile data available</h1>
        </div>
      </div>
    );
  }

  const artworkDetails = profileData.reviews.find(review => review.artworkid === artId);

  if (!artworkDetails) {
    return (
      <div className="art-review-page">
        <div className="container">
          <h1>Artwork not found for artId: {artId}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="art-review-page">
      <div className="artwork-container">
        <div className="artwork-header">
          <h1 className="artwork-title">{artworkDetails.artwork_name}</h1>
          <button 
            className={`favorite-toggle ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="favorite-icon" role="img" aria-hidden="true">
              {isFavorite ? '★' : '☆'}
            </span>
            <span className="sr-only">
              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </span>
          </button>
        </div>
        
        <div className="artwork-image-container">
          <img 
            src={artworkDetails.artwork_image} 
            alt={artworkDetails.artwork_name}
            className="artwork-image"
          />
        </div>

        <div className="artwork-details">
          {!personalReview && !showReviewForm ? (
            <div className="section create-section">
              <h2 className="section-title">Add Your Review</h2>
              <button 
                className="create-button"
                onClick={() => setShowReviewForm(true)}
              >
                <span>+</span> Write a Review
              </button>
            </div>
          ) : showReviewForm ? (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Write Your Review</h2>
              </div>
              <form onSubmit={handleSubmitReview} className="create-form">
                <div className="form-group">
                  <label htmlFor="rating">Rating (1-5)</label>
                  <input
                    type="number"
                    id="rating"
                    min="1"
                    max="5"
                    className="rating-input"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="review">Review</label>
                  <textarea
                    id="review"
                    rows="4"
                    value={newReview.review_text}
                    onChange={(e) => setNewReview({...newReview, review_text: e.target.value})}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Your Review</h2>
                <button 
                  className="delete-button" 
                  onClick={handleDeleteReview}
                  aria-label="Delete review"
                >
                  <span className="delete-icon">×</span>
                  Delete
                </button>
              </div>
              <div className="review-item">
                <div className="rating">Rating: {personalReview.rating}/5</div>
                <p>{personalReview.review_text}</p>
                <div className="timestamp">
                  {new Date(personalReview.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}

          {!personalNote && !showNoteForm ? (
            <div className="section create-section">
              <h2 className="section-title">Add a Note</h2>
              <button 
                className="create-button"
                onClick={() => setShowNoteForm(true)}
              >
                <span>+</span> Add Note
              </button>
            </div>
          ) : showNoteForm ? (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Write Your Note</h2>
              </div>
              <form onSubmit={handleSubmitNote} className="create-form">
                <div className="form-group">
                  <label htmlFor="note">Note</label>
                  <textarea
                    id="note"
                    rows="4"
                    value={newNote.note_text}
                    onChange={(e) => setNewNote({...newNote, note_text: e.target.value})}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowNoteForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Submit Note
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Your Note</h2>
                <button 
                  className="delete-button" 
                  onClick={handleDeleteNote}
                  aria-label="Delete note"
                >
                  <span className="delete-icon">×</span>
                  Delete
                </button>
              </div>
              <div className="note-item">
                <p>{personalNote.note_text}</p>
                <div className="timestamp">
                  {new Date(personalNote.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtReviewPage;