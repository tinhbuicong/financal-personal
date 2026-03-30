<script lang="ts">
  // Header component representing the top bar area
</script>

<header class="top-header">
  <div class="header-left">
    <button class="back-btn">
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
    
    <nav class="breadcrumbs">
      <a href="#home">Home</a>
      <span class="separator">/</span>
      <a href="#events">Events</a>
      <span class="separator">/</span>
      <span class="current">Calendar</span>
    </nav>
  </div>

  <div class="header-right">
    <div class="search-box">
      <svg class="search-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input type="text" placeholder="Search User, Events and more..." />
    </div>

    <div class="actions">
      <div class="dropdown language-selector">
        <span>English</span>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <button class="action-btn">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <button class="action-btn notification-btn">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="badge">1</span>
      </button>

      <div class="user-profile">
        <img src="https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff" alt="User Profile" />
      </div>
    </div>
  </div>
</header>

<style>
  .top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
    background-color: var(--bg-color); /* To match body bg */
    border-bottom: 1px solid transparent; /* Remove old border */
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
  }
  .back-btn:hover {
    color: var(--accent);
  }

  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .breadcrumbs a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;
  }
  .breadcrumbs a:hover {
    color: var(--accent);
  }

  .breadcrumbs .separator {
    color: var(--text-secondary);
    font-size: 12px;
  }

  .breadcrumbs .current {
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Header Right Area */
  .header-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1; /* Take remaining space */
    margin-left: 48px;
  }

  .search-box {
    position: relative;
    width: 100%;
    max-width: 400px;
    display: flex;
    align-items: center;
  }

  .search-box .search-icon {
    position: absolute;
    left: 14px;
  }

  .search-box input {
    width: 100%;
    padding: 10px 16px 10px 44px;
    border-radius: 20px;
    border: 1px solid var(--border-color);
    background: white;
    font-size: 14px;
  }
  .search-box input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .language-selector {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-secondary);
  }
  .language-selector:hover {
    color: var(--text-primary);
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .action-btn:hover {
    color: var(--text-primary);
  }

  .notification-btn .badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background: #f59e0b;
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-profile {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;
  }
  .user-profile:hover {
    border-color: var(--accent);
  }

  .user-profile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
