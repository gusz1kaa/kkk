// ============================================
// BROTHER CORE TV - SISTEMA COMPLETO ESTILO YOUTUBE
// ============================================

class BrotherCoreTV {
    constructor() {
        this.state = {
            isSubscribed: false,
            isLiked: false,
            isDisliked: false,
            likeCount: 15234,
            subscriberCount: 0,
            comments: [],
            videoProgress: 0,
            currentVideoId: 1
        };
        
        this.init();
    }
    
    init() {
        this.loadComments();
        this.setupEventListeners();
        this.loadRecommendedVideos();
        this.updateUI();
        this.initVideoPlayer();
        console.log('🛹 z1kas');
    }
    
    setupEventListeners() {
        // Subscribe button
        const subscribeBtn = document.getElementById('subscribeBtn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', () => this.toggleSubscribe());
        }
        
        // Like/Dislike buttons
        const likeBtn = document.getElementById('likeBtn');
        const dislikeBtn = document.getElementById('dislikeBtn');
        
        if (likeBtn) {
            likeBtn.addEventListener('click', () => this.toggleLike());
        }
        
        if (dislikeBtn) {
            dislikeBtn.addEventListener('click', () => this.toggleDislike());
        }
        
        // Comment system
        const commentInput = document.getElementById('commentInput');
        const submitComment = document.getElementById('submitComment');
        const cancelComment = document.getElementById('cancelComment');
        
        if (commentInput) {
            commentInput.addEventListener('focus', () => this.showCommentActions());
            commentInput.addEventListener('input', () => this.updateCommentButton());
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.addComment();
                }
            });
        }
        
        if (submitComment) {
            submitComment.addEventListener('click', () => this.addComment());
        }
        
        if (cancelComment) {
            cancelComment.addEventListener('click', () => this.hideCommentActions());
        }
        
        // Video player events
        const video = document.getElementById('mainVideo');
        if (video) {
            video.addEventListener('timeupdate', () => this.updateProgress());
            video.addEventListener('play', () => this.onVideoPlay());
            video.addEventListener('pause', () => this.onVideoPause());
        }
        
        // Progress bar click
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seekVideo(e));
        }
        
        // Load more comments
        const loadMoreBtn = document.getElementById('loadMoreComments');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreComments());
        }
    }
    
    // ========== SUBSCRIBE SYSTEM ==========
    toggleSubscribe() {
        this.state.isSubscribed = !this.state.isSubscribed;
        
        if (this.state.isSubscribed) {
            this.state.subscriberCount++;
            this.showNotification('Inscrito! Bem-vindo à família BrotherCore! 🛹');
        } else {
            this.state.subscriberCount--;
            this.showNotification('Inscrição cancelada 😢');
        }
        
        this.updateUI();
        this.saveState();
    }
    
    // ========== LIKE/DISLIKE SYSTEM ==========
    toggleLike() {
        const likeBtn = document.getElementById('likeBtn');
        
        if (this.state.isLiked) {
            this.state.isLiked = false;
            this.state.likeCount--;
            likeBtn?.classList.remove('liked');
        } else {
            this.state.isLiked = true;
            this.state.likeCount++;
            likeBtn?.classList.add('liked');
            
            // Remove dislike if active
            if (this.state.isDisliked) {
                this.state.isDisliked = false;
                document.getElementById('dislikeBtn')?.classList.remove('disliked');
            }
        }
        
        this.updateUI();
        this.saveState();
    }
    
    toggleDislike() {
        const dislikeBtn = document.getElementById('dislikeBtn');
        
        if (this.state.isDisliked) {
            this.state.isDisliked = false;
            dislikeBtn?.classList.remove('disliked');
        } else {
            this.state.isDisliked = true;
            dislikeBtn?.classList.add('disliked');
            
            // Remove like if active
            if (this.state.isLiked) {
                this.state.isLiked = false;
                this.state.likeCount--;
                document.getElementById('likeBtn')?.classList.remove('liked');
            }
        }
        
        this.updateUI();
        this.saveState();
    }
    
    // ========== COMMENT SYSTEM ==========
    showCommentActions() {
        const actions = document.getElementById('commentActions');
        if (actions) actions.style.display = 'flex';
    }
    
    hideCommentActions() {
        const actions = document.getElementById('commentActions');
        const input = document.getElementById('commentInput');
        if (actions) actions.style.display = 'none';
        if (input) input.value = '';
        this.updateCommentButton();
    }
    
    updateCommentButton() {
        const input = document.getElementById('commentInput');
        const submitBtn = document.getElementById('submitComment');
        
        if (submitBtn) {
            submitBtn.disabled = !input?.value.trim();
        }
    }
    
    addComment() {
        const input = document.getElementById('commentInput');
        const commentText = input?.value.trim();
        
        if (!commentText) return;
        
        const newComment = {
            id: Date.now(),
            author: 'Você',
            avatar: 'V',
            text: commentText,
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: [],
            timeAgo: 'Agora mesmo'
        };
        
        this.state.comments.unshift(newComment);
        this.renderComments();
        this.hideCommentActions();
        this.saveComments();
        this.updateCommentCount();
        
        // Animate new comment
        setTimeout(() => {
            const firstComment = document.querySelector('.comment-item');
            if (firstComment) {
                firstComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
    
    renderComments() {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;
        
        commentsList.innerHTML = this.state.comments.map(comment => `
            <div class="comment-item">
                <div class="user-avatar comment-avatar" style="background: linear-gradient(135deg, #ff00c8, #39ff14);">
                    ${comment.avatar}
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-time">${comment.timeAgo}</span>
                    </div>
                    <div class="comment-text">${this.escapeHtml(comment.text)}</div>
                    <div class="comment-actions">
                        <button class="comment-action-btn" onclick="window.brotherCore.likeComment(${comment.id})">
                            👍
                        </button>
                        <span class="comment-likes">${comment.likes > 0 ? comment.likes : ''}</span>
                        <button class="comment-action-btn" onclick="window.brotherCore.dislikeComment(${comment.id})">
                            👎
                        </button>
                        <button class="reply-btn">Responder</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    likeComment(commentId) {
        const comment = this.state.comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes++;
            this.renderComments();
            this.saveComments();
        }
    }
    
    dislikeComment(commentId) {
        const comment = this.state.comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes = Math.max(0, comment.likes - 1);
            this.renderComments();
            this.saveComments();
        }
    }
    
    updateCommentCount() {
        const totalComments = document.getElementById('totalComments');
        if (totalComments) {
            const count = this.state.comments.length;
            totalComments.textContent = this.formatNumber(count);
        }
    }
    
    loadMoreComments() {
        // Simulate loading more comments
        const moreComments = [
            {
                id: Date.now() + 1,
                author: 'skater_pro99',
                avatar: '🏄',
                text: 'Mano, esse kickflip foi insano! 🔥',
                timestamp: new Date().toISOString(),
                likes: 234,
                replies: [],
                timeAgo: 'Há 2 horas'
            },
            {
                id: Date.now() + 2,
                author: 'vert_warrior',
                avatar: '🛹',
                text: 'Alguém sabe qual pista é essa?',
                timestamp: new Date().toISOString(),
                likes: 56,
                replies: [],
                timeAgo: 'Há 3 horas'
            },
            {
                id: Date.now() + 3,
                author: 'flip_master',
                avatar: '⭐',
                text: 'Treino todo dia pra chegar nesse nível!',
                timestamp: new Date().toISOString(),
                likes: 89,
                replies: [],
                timeAgo: 'Há 5 horas'
            }
        ];
        