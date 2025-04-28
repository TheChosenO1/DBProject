import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import profileService from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import './ArtReviewPage.css';
import artService from '../../services/artService';
import uploadService from '../../services/uploadService';
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

  const [expandedSections, setExpandedSections] = useState({
    artist: false,
    museum: false,
    stats: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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


  const handleDeleteReview = async (e) => {
    
      const reviewId = artwork.userReview.id;
      if (!reviewId) return;

      try{
        await uploadService.removeReview(reviewId);
        
        setArtwork(prev => ({
          ...prev, 
          userReview: {
            id: null,
            rating: null,
            review_text: '',
            timestamp: null
          },
          reviews: prev.reviews.filter(review => review.id !== reviewId),
          stats: {
            ...prev.stats,
          }
          
      }));
      
    }catch(error) {
        console.error('Error deleting review:', error);
    }
    
  };

  
  const handleDeleteNote = async () => {
    const noteId = artwork.userNotes.id;
  if (!noteId) return;

  try {
    await uploadService.removeNote(noteId);

    setArtwork(prev => ({
      ...prev,
      userNotes: {
        id:         null,
        note_text:  '',
        timestamp:  null
      }
    }));

    setPersonalNote(null);
  } catch (error) {
    console.error('Error deleting note:', error);
  }
  };
  
  const handleSubmitReview = async () => {
    //e.preventDefault();

    // pull out your form values
    const rating     = parseInt(newReview.rating, 10);
    const reviewText = newReview.review_text;
  
    try {
      // 1) send to backend
      await uploadService.addReview(artId, rating, reviewText);
      const details = await artService.getArtDetails(artId);
  
      // 2) patch artwork exactly like your delete logic
      setArtwork(prev => ({
        ...details
        // you can also recalc stats.avgrating here if you like
      }));
  
      // 3) mirror it in your personalReview state & close the form
      setPersonalReview({
        id:          saved.id,
        rating:      saved.rating,
        review_text: saved.review_text,
        timestamp:   saved.timestamp
      });
      setShowReviewForm(false);
  
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleSubmitNote = async () => {
    const noteText  =  newNote.note_text;

    try{
      // 1) send to backend
      await uploadService.addNote(artId, noteText);
      const details = await artService.getArtDetails(artId);
  
      // 2) patch artwork exactly like your delete logic
      setArtwork(prev => ({
        ...details
        // you can also recalc stats.avgrating here if you like
      }));
  
      // 3) mirror it in your personalReview state & close the form
      setPersonalNote({
        id:         saved.id,
        note_text:  saved.note_text,
        timestamp:  saved.timestamp
      });
      setShowNoteForm(false);
    } catch(error) {  
      console.error('Error adding note:', error);
    }
  };
  const toggleSeen = async () => {
    try {
      let result;
      if (artwork.hasSeen) {
        result = await uploadService.removeFromSeen(artId);
      } else {
        result = await uploadService.markAsSeen(artId);
      }
      setArtwork(prev => ({
        ...prev,
        hasSeen: !prev.hasSeen
      }));
    } catch (err) {
      console.error('Error toggling seen:', err);
    }
  };
  const toggleFavorite = async () => {
    try {
      let result;
      if (artwork.hasFav) {
        result = await uploadService.removeFromFavorites(artId);
        console.log('Result of removing from favorites:', result);
      } else {
        result = await uploadService.addToFavorites(artId);
        console.log('Result of adding to favorites:', result);
      }
      setArtwork(prevState => ({
        ...prevState,
        hasFav: !prevState.hasFav
      })); // Toggle the favorite state
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleEditNote = () => {
    setEditedNote({ note_text: personalNote.note_text });
    setIsEditingNote(true);
  };

  const handleCancelEditNote = () => {
    setIsEditingNote(false);
    setEditedNote({ note_text: '' });
  };

  const handleSubmitEditNote = async () => {
  await uploadService.editNote(personalNote.id, editedNote.note_text);

  // pull down the updated artwork (with the edited note)
  const details = await artService.getArtDetails(artId);

  // overwrite your artwork state in one go
  setArtwork(details);

  // sync your local note copy
  setPersonalNote(details.userNotes);

  // close the edit form
  setIsEditingNote(false);
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

  if (!artwork.id) {
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
          <h1 className="artwork-title">{artwork.title}</h1>
          <button 
            className={`favorite-toggle ${artwork.hasFav ? 'active' : ''}`}
            onClick={toggleFavorite}
            aria-label={artwork.hasFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="favorite-icon" role="img" aria-hidden="true">
              {artwork.hasFav ? '★' : '☆'}
            </span>
            <span className="sr-only">
              {artwork.hasFav ? 'Remove from favorites' : 'Add to favorites'}
            </span>
          </button>
        </div>
        
        <div className="artwork-image-container">
          <img 
            src={artwork.imageurl} 
            alt={artwork.title}
            className="artwork-image"
          />
        </div>

        {/* Artist Details Section */}
        <div className="details-section">
          <div 
            className="details-header"
            onClick={() => toggleSection('artist')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleSection('artist')}
          >
            <h2 className="details-title">Artist Information</h2>
            <span className={`expand-icon ${expandedSections.artist ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.artist && (
            <div className="details-content">
              <div className="details-row">
                <span className="details-label">Name</span>
                <span className="details-value">{artwork.artist.artist_name}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Biography</span>
                <span className="details-value">{artwork.artist.artist_bio}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Birth Date</span>
                <span className="details-value">
                  {new Date(artwork.artist.artist_birthdate).toLocaleDateString()}
                </span>
              </div>
              <div className="details-row">
                <span className="details-label">Death Date</span>
                <span className="details-value">
                  {artwork.artist.artist_deathdate ? 
                    new Date(artwork.artist.artist_deathdate).toLocaleDateString() : 
                    'N/A'}
                </span>
              </div>
              <div className="details-row">
                <span className="details-label">Age</span>
                <span className="details-value">{artwork.artist.artist_age}</span>
              </div>
            </div>
          )}
        </div>

        {/* Museum Details Section */}
        <div className="details-section">
          <div 
            className="details-header"
            onClick={() => toggleSection('museum')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleSection('museum')}
          >
            <h2 className="details-title">Museum Information</h2>
            <span className={`expand-icon ${expandedSections.museum ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.museum && (
            <div className="details-content">
              <div className="details-row">
                <span className="details-label">Name</span>
                <span className="details-value">{artwork.museum.museum_name}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Location</span>
                <span className="details-value">{artwork.museum.museum_loc}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Hours</span>
                <span className="details-value">{artwork.museum.museum_hours}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Contact</span>
                <span className="details-value">{artwork.museum.museum_contact}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="details-section">
          <div 
            className="details-header"
            onClick={() => toggleSection('stats')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleSection('stats')}
          >
            <h2 className="details-title">Artwork Statistics</h2>
            <span className={`expand-icon ${expandedSections.stats ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.stats && (
            <div className="details-content">
              <div className="details-row">
                <span className="details-label">Views</span>
                <span className="details-value">{artwork.stats.views}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Favorites</span>
                <span className="details-value">{artwork.stats.favs}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Average Rating</span>
                <span className="details-value">{artwork.stats.avgrating}/5</span>
              </div>
              <div className="details-row">
                <span className="details-label">Gallery Number</span>
                <span className="details-value">{artwork.gallery_number}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Date Created</span>
                <span className="details-value">
                  {new Date(artwork.date_created).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="artwork-details">
          {!artwork.userReview.id && !showReviewForm ? (
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
                <div className="rating">Rating: {artwork.userReview.rating}/5</div>
                <p>{artwork.userReview.review_text}</p>
                <div className="timestamp">
                  {new Date(artwork.userReview.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}

          {!artwork.userNotes.id && !showNoteForm ? (
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
                  <p>{artwork.userNotes.note_text}</p>
                  <div className="timestamp">
                    {new Date(artwork.userNotes.timestamp).toLocaleDateString(undefined, {
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