// components/MinhaConta/Tabs.jsx

const Tabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: 'bi-person-circle' },
    { id: 'senha', label: 'Segurança', icon: 'bi-shield-lock' }
  ];

  return (
    <div className="tabs-container" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={`bi ${tab.icon}`}></i>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;