/* ==========================================================
   Brittany Bravo — Portfolio JS
   Album management, media uploads, masonry grid, lightbox
   ========================================================== */

(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────
  const STORAGE_KEY = 'bb_portfolio';

  // Default demo data so the site isn't empty on first load
  const DEFAULT_DATA = {
    albums: [
      { id: 'editorial', name: 'Editorial' },
      { id: 'beauty', name: 'Beauty' },
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'portraits', name: 'Portraits' },
      { id: 'commissioned', name: 'Commissioned' },
      { id: 'motion', name: 'Motion' },
    ],
    media: [
      { id: 'm1',  albumId: 'editorial',    type: 'image', src: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=80',  name: 'Monarch Portrait' },
      { id: 'm2',  albumId: 'beauty',        type: 'image', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',  name: 'Wedding Flowers' },
      { id: 'm3',  albumId: 'lifestyle',     type: 'image', src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',  name: 'Desert Sunset' },
      { id: 'm4',  albumId: 'editorial',     type: 'image', src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',  name: 'Close-up Beauty' },
      { id: 'm5',  albumId: 'commissioned',  type: 'image', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',  name: 'Fashion Portrait' },
      { id: 'm6',  albumId: 'portraits',     type: 'image', src: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80',  name: 'Couple Session' },
      { id: 'm7',  albumId: 'beauty',        type: 'image', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',  name: 'Warm Portrait' },
      { id: 'm8',  albumId: 'lifestyle',     type: 'image', src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',  name: 'Urban Editorial' },
      { id: 'm9',  albumId: 'portraits',     type: 'image', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',  name: 'Studio Shot' },
      { id: 'm10', albumId: 'beauty',        type: 'image', src: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?w=600&q=80',  name: 'Glow Skin' },
      { id: 'm11', albumId: 'editorial',     type: 'image', src: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=600&q=80',  name: 'Golden Hour' },
      { id: 'm12', albumId: 'commissioned',  type: 'image', src: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80',  name: 'Brand Campaign' },
      { id: 'm13', albumId: 'beauty',        type: 'image', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',  name: 'Beauty Close-Up' },
      { id: 'm14', albumId: 'lifestyle',     type: 'image', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',  name: 'Street Style' },
      { id: 'm15', albumId: 'commissioned',  type: 'image', src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',  name: 'Outdoor Session' },
      { id: 'm16', albumId: 'portraits',     type: 'image', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',  name: 'Fashion Studio' },
      { id: 'm17', albumId: 'editorial',     type: 'image', src: 'https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=600&q=80',  name: 'Film Editorial' },
      { id: 'm18', albumId: 'lifestyle',     type: 'image', src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80',  name: 'Joy Portrait' },
    ],
  };

  let state = loadState();
  let currentAlbum = 'all';      // 'all' or album id
  let pendingFiles = [];          // files staged for upload
  let albumModalMode = 'create';  // 'create' | 'rename'
  let lightboxIndex = 0;
  let lightboxItems = [];

  // ── DOM refs ──────────────────────────────────────────
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const hamburgerBtn    = $('#hamburgerBtn');
  const sideNav         = $('#sideNav');
  const navOverlay      = $('#navOverlay');
  const navCloseBtn     = $('#navCloseBtn');
  const navLinksContainer = $('#navLinks');

  const albumHeader     = $('#albumHeader');
  const albumTitleEl    = $('#albumTitle');
  const albumActions    = $('#albumActions');
  const btnUpload       = $('#btnUpload');
  const btnUploadEmpty  = $('#btnUploadEmpty');
  const btnRenameAlbum  = $('#btnRenameAlbum');
  const btnDeleteAlbum  = $('#btnDeleteAlbum');
  const masonryGrid     = $('#masonryGrid');
  const emptyState      = $('#emptyState');

  const uploadModal     = $('#uploadModal');
  const uploadModalClose = $('#uploadModalClose');
  const uploadAlbumSelect = $('#uploadAlbumSelect');
  const dropZone        = $('#dropZone');
  const fileInput       = $('#fileInput');
  const previewGrid     = $('#uploadPreviewGrid');
  const btnConfirmUpload = $('#btnConfirmUpload');

  const albumModal      = $('#albumModal');
  const albumModalClose = $('#albumModalClose');
  const albumModalTitle = $('#albumModalTitle');
  const albumNameInput  = $('#albumNameInput');
  const btnConfirmAlbum = $('#btnConfirmAlbum');

  const deleteModal     = $('#deleteModal');
  const deleteModalClose = $('#deleteModalClose');
  const deleteAlbumName = $('#deleteAlbumName');
  const btnCancelDelete = $('#btnCancelDelete');
  const btnConfirmDelete = $('#btnConfirmDelete');

  const lightbox        = $('#lightbox');
  const lightboxClose   = $('#lightboxClose');
  const lightboxPrev    = $('#lightboxPrev');
  const lightboxNext    = $('#lightboxNext');
  const lightboxContent = $('#lightboxContent');
  const lightboxCaption = $('#lightboxCaption');

  const logoHome        = $('#logoHome');
  const siteHeader      = $('.site-header');

  // ── Persistence ───────────────────────────────────────
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  function saveState() {
    // Only save non-demo data (external URLs persist fine;
    // base64 data URLs from uploads are stored too — acceptable for a portfolio)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function uid() {
    return 'id_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  // ── Nav ───────────────────────────────────────────────
  function openNav() {
    sideNav.classList.add('open');
    navOverlay.classList.add('open');
    hamburgerBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    sideNav.classList.remove('open');
    navOverlay.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    sideNav.classList.contains('open') ? closeNav() : openNav();
  });
  navCloseBtn.addEventListener('click', closeNav);
  navOverlay.addEventListener('click', closeNav);

  // Build nav links from albums
  function renderNavLinks() {
    let html = '<li><a href="#" data-album="all" class="nav-link">All Work</a></li>';
    state.albums.forEach((a) => {
      html += `<li><a href="#" data-album="${a.id}" class="nav-link">${a.name}</a></li>`;
    });
    navLinksContainer.innerHTML = html;

    // Mark active
    navLinksContainer.querySelectorAll('.nav-link').forEach((l) => {
      if (l.dataset.album === currentAlbum) l.classList.add('active');
    });

    // Click handlers
    navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        currentAlbum = link.dataset.album;
        renderNavLinks();
        renderGallery();
        closeNav();
      });
    });
  }

  logoHome.addEventListener('click', (e) => {
    e.preventDefault();
    currentAlbum = 'all';
    renderNavLinks();
    renderGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Gallery rendering ─────────────────────────────────
  const HEIGHT_CLASSES = ['h-short', 'h-medium', 'h-tall'];

  function getFilteredMedia() {
    if (currentAlbum === 'all') return state.media;
    return state.media.filter((m) => m.albumId === currentAlbum);
  }

  function renderGallery() {
    const items = getFilteredMedia();

    // Title
    if (currentAlbum === 'all') {
      albumTitleEl.textContent = 'All Work';
      btnRenameAlbum.style.display = 'none';
      btnDeleteAlbum.style.display = 'none';
    } else {
      const album = state.albums.find((a) => a.id === currentAlbum);
      albumTitleEl.textContent = album ? album.name : 'Album';
      btnRenameAlbum.style.display = '';
      btnDeleteAlbum.style.display = '';
    }

    // Empty?
    if (items.length === 0) {
      masonryGrid.innerHTML = '';
      emptyState.classList.add('visible');
      return;
    }
    emptyState.classList.remove('visible');

    // Build cards
    let html = '';
    items.forEach((item, i) => {
      const hClass = HEIGHT_CLASSES[i % 3];
      const isVideo = item.type === 'video';

      html += `<div class="card ${hClass}" data-index="${i}" data-id="${item.id}">`;

      if (isVideo) {
        html += `<video src="${item.src}" muted preload="metadata"></video>`;
        html += `<div class="play-badge"><svg viewBox="0 0 24 24"><polygon points="6,3 20,12 6,21"/></svg></div>`;
      } else {
        html += `<img src="${item.src}" alt="${item.name}" loading="lazy" />`;
      }

      html += `<button class="card-delete" data-id="${item.id}" title="Remove">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
      html += `</div>`;
    });

    masonryGrid.innerHTML = html;

    // Card click → lightbox
    masonryGrid.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-delete')) return;
        lightboxItems = items;
        lightboxIndex = parseInt(card.dataset.index, 10);
        openLightbox();
      });
    });

    // Delete media
    masonryGrid.querySelectorAll('.card-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        state.media = state.media.filter((m) => m.id !== id);
        saveState();
        renderGallery();
      });
    });
  }

  // ── Lightbox ──────────────────────────────────────────
  function openLightbox() {
    showLightboxItem();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxContent.innerHTML = '';
  }

  function showLightboxItem() {
    const item = lightboxItems[lightboxIndex];
    if (!item) return;

    if (item.type === 'video') {
      lightboxContent.innerHTML = `<video src="${item.src}" controls autoplay style="max-width:90vw;max-height:85vh;"></video>`;
    } else {
      lightboxContent.innerHTML = `<img src="${item.src}" alt="${item.name}" />`;
    }
    lightboxCaption.textContent = item.name || '';

    lightboxPrev.style.display = lightboxIndex > 0 ? '' : 'none';
    lightboxNext.style.display = lightboxIndex < lightboxItems.length - 1 ? '' : 'none';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => {
    if (lightboxIndex > 0) { lightboxIndex--; showLightboxItem(); }
  });
  lightboxNext.addEventListener('click', () => {
    if (lightboxIndex < lightboxItems.length - 1) { lightboxIndex++; showLightboxItem(); }
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxIndex > 0) { lightboxIndex--; showLightboxItem(); }
    if (e.key === 'ArrowRight' && lightboxIndex < lightboxItems.length - 1) { lightboxIndex++; showLightboxItem(); }
  });

  // ── Upload modal ──────────────────────────────────────
  function openUploadModal() {
    pendingFiles = [];
    previewGrid.innerHTML = '';
    btnConfirmUpload.disabled = true;
    fileInput.value = '';
    populateAlbumSelect();
    uploadModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeUploadModal() {
    uploadModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function populateAlbumSelect() {
    let html = '';
    state.albums.forEach((a) => {
      const sel = a.id === currentAlbum ? 'selected' : '';
      html += `<option value="${a.id}" ${sel}>${a.name}</option>`;
    });
    if (state.albums.length === 0) {
      html = '<option disabled>No albums — create one first</option>';
    }
    uploadAlbumSelect.innerHTML = html;
  }

  btnUpload.addEventListener('click', openUploadModal);
  btnUploadEmpty.addEventListener('click', openUploadModal);
  uploadModalClose.addEventListener('click', closeUploadModal);

  // Drag and drop
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });

  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  function handleFiles(fileList) {
    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const entry = {
          id: uid(),
          dataUrl: e.target.result,
          name: file.name.replace(/\.[^.]+$/, ''),
          type: file.type.startsWith('video/') ? 'video' : 'image',
        };
        pendingFiles.push(entry);
        renderUploadPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderUploadPreviews() {
    let html = '';
    pendingFiles.forEach((f, i) => {
      if (f.type === 'video') {
        html += `<div class="upload-preview-item"><video src="${f.dataUrl}" muted></video><button class="remove-preview" data-i="${i}">&times;</button></div>`;
      } else {
        html += `<div class="upload-preview-item"><img src="${f.dataUrl}" alt="" /><button class="remove-preview" data-i="${i}">&times;</button></div>`;
      }
    });
    previewGrid.innerHTML = html;
    btnConfirmUpload.disabled = pendingFiles.length === 0;

    previewGrid.querySelectorAll('.remove-preview').forEach((btn) => {
      btn.addEventListener('click', () => {
        pendingFiles.splice(parseInt(btn.dataset.i, 10), 1);
        renderUploadPreviews();
      });
    });
  }

  btnConfirmUpload.addEventListener('click', () => {
    const targetAlbum = uploadAlbumSelect.value;
    if (!targetAlbum || pendingFiles.length === 0) return;

    pendingFiles.forEach((f) => {
      state.media.push({
        id: f.id,
        albumId: targetAlbum,
        type: f.type,
        src: f.dataUrl,
        name: f.name,
      });
    });
    saveState();
    closeUploadModal();
    currentAlbum = targetAlbum;
    renderNavLinks();
    renderGallery();
  });

  // ── Album create / rename modal ───────────────────────
  function openAlbumModal(mode) {
    albumModalMode = mode;
    if (mode === 'create') {
      albumModalTitle.textContent = 'Create Album';
      btnConfirmAlbum.textContent = 'Create';
      albumNameInput.value = '';
    } else {
      const album = state.albums.find((a) => a.id === currentAlbum);
      albumModalTitle.textContent = 'Rename Album';
      btnConfirmAlbum.textContent = 'Save';
      albumNameInput.value = album ? album.name : '';
    }
    albumModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => albumNameInput.focus(), 100);
  }

  function closeAlbumModal() {
    albumModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  $('#btnCreateAlbum').addEventListener('click', () => { closeNav(); openAlbumModal('create'); });
  btnRenameAlbum.addEventListener('click', () => openAlbumModal('rename'));
  albumModalClose.addEventListener('click', closeAlbumModal);

  btnConfirmAlbum.addEventListener('click', () => {
    const name = albumNameInput.value.trim();
    if (!name) return;

    if (albumModalMode === 'create') {
      const id = 'album_' + uid();
      state.albums.push({ id, name });
      saveState();
      currentAlbum = id;
    } else {
      const album = state.albums.find((a) => a.id === currentAlbum);
      if (album) album.name = name;
      saveState();
    }

    closeAlbumModal();
    renderNavLinks();
    renderGallery();
  });

  albumNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnConfirmAlbum.click();
  });

  // ── Album delete modal ────────────────────────────────
  function openDeleteModal() {
    const album = state.albums.find((a) => a.id === currentAlbum);
    if (!album) return;
    deleteAlbumName.textContent = album.name;
    deleteModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  btnDeleteAlbum.addEventListener('click', openDeleteModal);
  deleteModalClose.addEventListener('click', closeDeleteModal);
  btnCancelDelete.addEventListener('click', closeDeleteModal);

  btnConfirmDelete.addEventListener('click', () => {
    state.media = state.media.filter((m) => m.albumId !== currentAlbum);
    state.albums = state.albums.filter((a) => a.id !== currentAlbum);
    saveState();
    currentAlbum = 'all';
    closeDeleteModal();
    renderNavLinks();
    renderGallery();
  });

  // Close modals on overlay click
  [uploadModal, albumModal, deleteModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (uploadModal.classList.contains('open')) closeUploadModal();
      if (albumModal.classList.contains('open')) closeAlbumModal();
      if (deleteModal.classList.contains('open')) closeDeleteModal();
    }
  });

  // ── Header scroll shadow ─────────────────────────────
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // ── Init ──────────────────────────────────────────────
  renderNavLinks();
  renderGallery();

})();
