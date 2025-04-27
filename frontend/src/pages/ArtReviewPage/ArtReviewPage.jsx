import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import profileService from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import './ArtReviewPage.css';
import artService from '../../services/artService';

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
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState({ note_text: '' });
  
  // Artwork details from the second useEffect
  const [artworkDetails, setArtworkDetails] = useState(null);
  
  // User data from profile
  const [userData, setUserData] = useState(null);
  
  // Collection data from the artwork details
  const [artwork, setArtwork] = useState({
    // Basic artwork information
    id: null,
    gallery_number: null,
    title: null,
    date_created: null,
    imageurl: null,
    artistid: null,
    museumid: null,
    
    // Artist information
    artist: {
      artist_name: null,
      artist_bio: null,
      artist_birthdate: null,
      artist_deathdate: null,
      artist_age: null
    },
    
    // Museum information
    museum: {
      museum_name: null,
      museum_loc: null,
      museum_hours: null,
      museum_contact: null
    },
    
    // Reviews
    reviews: [],
    
    // User-specific information
    userReview: {
      id: null,
      rating: null,
      review_text: null,
      timestamp: null
    },
    
    userNotes: {
      id: null,
      note_text: null,
      timestamp: null
    },
    
    // Status flags
    hasSeen: null,
    hasFav: null,
    
    // Statistics
    stats: {
      views: null,
      favs: null,
      avgrating: null
    }
  });


  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.userid) {
        try {
          const data = await profileService.getProfile(user.userid);
          
          // Save the entire profile data
          setProfileData(data);
          console.log('Profile Data:', data);
          
          // Save individual state variables for each piece of data
        //   setUserData(data.user);
        //   setReviews(data.reviews || []);
        //   setNotes(data.notes || []);
        //   setArtSeen(data.artSeen || []);
        //   setFavs(data.favs || []);
          
          // Set initial review, note, and favorite status for this artwork
          const personalReview = data.reviews?.find(review => review.artworkid === artId);
          const personalNote = data.notes?.find(note => note.artworkid === artId);
          const personalFavorite = data.favs?.some(fav => fav.artworkid === artId);
          
          setPersonalReview(personalReview || null);
          setPersonalNote(personalNote || null);
          setIsFavorite(personalFavorite || false);
          
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user?.userid]); //, artId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await artService.getArtDetails(artId);
        console.log('Artwork Details:', details);
        console.log('details.id:', details.id);
        setArtwork({
          // Basic artwork information
          id: details.id || null,
          gallery_number: details.gallery_number || null,
          title: details.title || null,
          date_created: details.date_created || null,
          imageurl: details.imageurl || null,
          artistid: details.artistid || null,
          museumid: details.museumid || null,
          
          // Artist information
          artist: {
            artist_name: details.artist?.artist_name || null,
            artist_bio: details.artist?.artist_bio || null,
            artist_birthdate: details.artist?.artist_birthdate || null,
            artist_deathdate: details.artist?.artist_deathdate || null,
            artist_age: details.artist?.artist_age || null
          },
          
          // Museum information
          museum: {
            museum_name: details.museum?.museum_name || null,
            museum_loc: details.museum?.museum_loc || null,
            museum_hours: details.museum?.museum_hours || null,
            museum_contact: details.museum?.museum_contact || null
          },
          
          // Reviews
          reviews: details.reviews || [],
          
          // User-specific information
          userReview: {
            id: details.userReview?.id || null,
            rating: details.userReview?.rating || null,
            review_text: details.userReview?.review_text || null,
            timestamp: details.userReview?.timestamp || null
          },
          
          userNotes: {
            id: details.userNotes?.id || null,
            note_text: details.userNotes?.note_text || null,
            timestamp: details.userNotes?.timestamp || null
          },
          
          // Status flags
          hasSeen: details.hasSeen ?? null,
          hasFav: details.hasFav ?? null,
          
          // Statistics
          stats: {
            views: details.stats?.views || null,
            favs: details.stats?.favs || null,
            avgrating: details.stats?.avgrating || null
          }
        });
        
      } catch (error) {
        console.error('Error fetching artwork details:', error);
      }
    };
    fetchData();
  }, [artId]);

  useEffect(() => {
    console.log('Artwork in state:', artwork);
  }, [artwork]);


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
      userid: user.userid,
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
      userid: user.userid,
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

  const handleEditNote = () => {
    setEditedNote({ note_text: personalNote.note_text });
    setIsEditingNote(true);
  };

  const handleCancelEditNote = () => {
    setIsEditingNote(false);
    setEditedNote({ note_text: '' });
  };

  const handleSubmitEditNote = (e) => {
    e.preventDefault();
    const updatedNote = {
      ...personalNote,
      note_text: editedNote.note_text,
      timestamp: new Date().toISOString()
    };
    setPersonalNote(updatedNote);
    setIsEditingNote(false);
    setEditedNote({ note_text: '' });
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
                <div className="note-actions">
                  <button 
                    className="edit-button" 
                    onClick={handleEditNote}
                    aria-label="Edit note"
                  >
                    <span className="edit-icon">✎</span>
                    Edit
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={handleDeleteNote}
                    aria-label="Delete note"
                  >
                    <span className="delete-icon">×</span>
                    Delete
                  </button>
                </div>
              </div>
              {isEditingNote ? (
                <form onSubmit={handleSubmitEditNote} className="create-form">
                  <div className="form-group">
                    <label htmlFor="editNote">Edit Note</label>
                    <textarea
                      id="editNote"
                      rows="4"
                      value={editedNote.note_text}
                      onChange={(e) => setEditedNote({...editedNote, note_text: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={handleCancelEditNote}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submit-button">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtReviewPage;