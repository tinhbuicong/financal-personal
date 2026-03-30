<script lang="ts">
  // Array of sidebar items mimicking the image
  const menuItems = [
    { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home', active: false },
    { id: 'building', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z', label: 'Company', active: false },
    { id: 'hourglass', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Time', active: false },
    { id: 'mail', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Messages', active: false },
    { id: 'receipt', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Invoices', active: false },
    { id: 'calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Calendar', active: true },
    { id: 'chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: 'Chat', active: false, badge: 2 },
    { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings', active: false },
    { id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profile', active: false }
  ];
</script>

<aside class="sidebar-wrapper">
  <!-- Top brand area -->
  <div class="brand">
    <div class="logo">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4C9.373 4 4 9.373 4 16c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 4c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z" fill="#F59E0B"/>
        <path d="M12 16a4 4 0 108 0 4 4 0 00-8 0z" fill="#10B981"/>
        <path d="M16 10a6 6 0 00-6 6h12a6 6 0 00-6-6z" fill="#EF4444"/>
      </svg>
    </div>
    <button class="menu-btn" aria-label="Toggle Menu">
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#f97316" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>

  <!-- Sidebar floating panel -->
  <div class="sidebar-panel">
    <nav class="menu-items">
      {#each menuItems as item}
        <a href="#{item.id}" class="menu-item {item.active ? 'active' : ''}" title={item.label}>
          <div class="icon-wrapper">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d={item.icon}/>
            </svg>
            {#if item.badge}
              <span class="badge">{item.badge}</span>
            {/if}
          </div>
        </a>
      {/each}
    </nav>
    
    <div class="sidebar-footer">
      <div class="user-avatar">
        <img src="https://ui-avatars.com/api/?name=Natalie&background=f97316&color=fff" alt="Natalie" />
        <span class="status-dot"></span>
      </div>
      <span class="user-name">Natalie</span>
    </div>
  </div>
</aside>

<style>
  .sidebar-wrapper {
    width: 80px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding: 1rem 0 1rem 1rem;
    z-index: 100;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    margin-left: 4px;
    background: white;
    padding: 6px 12px;
    border-radius: 20px;
    width: max-content;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
  }
  .menu-btn:hover {
    background: #f1f5f9;
  }

  .sidebar-panel {
    background: white;
    border-radius: 30px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    width: 72px;
    margin-left: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
    border: 1px solid #f1f5f9;
  }
  
  /* Semi-circle decoration behind active item */
  .sidebar-panel::before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    top: -20px;
    right: -50px;
  }

  .menu-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    align-items: center;
    flex: 1;
  }

  .menu-item {
    color: #f97316; /* Base orange for icons */
    opacity: 0.6;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 8px 0;
    position: relative;
    transition: all 0.3s ease;
  }

  .icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .menu-item:hover {
    opacity: 1;
  }

  .menu-item.active {
    opacity: 1;
    color: #f97316;
  }

  .menu-item.active .icon-wrapper {
    background: #fff7ed; /* Very light orange bg for active */
    box-shadow: 0 4px 10px rgba(249, 115, 22, 0.15);
  }

  .badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #f59e0b;
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
  }

  .sidebar-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: auto;
  }

  .user-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 2px;
    background: white;
    cursor: pointer;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .status-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background: #22c55e;
    border: 2px solid white;
    border-radius: 50%;
  }

  .user-name {
    color: #475569;
    font-size: 10px;
    font-weight: 500;
  }
</style>
