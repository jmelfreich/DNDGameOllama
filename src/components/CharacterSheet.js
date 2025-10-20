// frontend/src/components/CharacterSheet.js - WITH EQUIPMENT FILTERING
import React, { useState } from 'react';

function CharacterSheet({ character, onClose, onUpdateCharacter, isPartyMember }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const EQUIPMENT_SLOTS = {
    head: 'Head',
    armor: 'Armor',
    gloves: 'Gloves',
    feet: 'Feet',
    cape: 'Cape',
    r_hand: 'Right Hand',
    l_hand: 'Left Hand',
    ring1: 'Ring 1',
    ring2: 'Ring 2',
    earrings: 'Earrings'
  };

  const canEquipToSlot = (item, slot) => {
    if (!item || !item.type) return false;
    
    const itemType = item.type.toLowerCase();
    
    const slotMappings = {
      'head': ['helmet', 'hat', 'hood', 'crown', 'circlet', 'headband'],
      'armor': ['armor', 'robe', 'tunic', 'breastplate', 'chainmail', 'leather armor'],
      'gloves': ['gloves', 'gauntlets', 'bracers'],
      'feet': ['boots', 'shoes', 'sandals', 'greaves'],
      'cape': ['cape', 'cloak', 'mantle'],
      'r_hand': ['weapon', 'sword', 'axe', 'mace', 'bow', 'staff', 'dagger', 'hammer', 'spear'],
      'l_hand': ['shield', 'weapon', 'sword', 'dagger', 'off-hand'],
      'ring1': ['ring'],
      'ring2': ['ring'],
      'earrings': ['earrings', 'jewelry', 'amulet']
    };

    const validTypes = slotMappings[slot] || [];
    return validTypes.some(validType => itemType.includes(validType));
  };

  const getEquipment = () => {
    return character.equipment || {
      head: null,
      armor: null,
      gloves: null,
      feet: null,
      cape: null,
      r_hand: null,
      l_hand: null,
      ring1: null,
      ring2: null,
      earrings: null
    };
  };

  const getAbilityModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const getProficiencyBonus = () => {
    return Math.floor((character.level - 1) / 4) + 2;
  };

  const getArmorClass = () => {
    let baseAC = 10 + getAbilityModifier(character.dexterity);
    
    const equipment = getEquipment();
    if (equipment.armor && equipment.armor.armorClass) {
      baseAC = equipment.armor.armorClass;
    }

    Object.values(equipment).forEach(item => {
      if (item && item.acBonus) {
        baseAC += item.acBonus;
      }
    });

    return baseAC;
  };

  const getSavingThrow = (ability) => {
    const modifier = getAbilityModifier(character[ability]);
    const profBonus = getProficiencyBonus();
    
    const classSaveProficiencies = {
      'Fighter': ['strength', 'constitution'],
      'Wizard': ['intelligence', 'wisdom'],
      'Rogue': ['dexterity', 'intelligence'],
      'Cleric': ['wisdom', 'charisma'],
      'Ranger': ['strength', 'dexterity'],
      'Paladin': ['wisdom', 'charisma'],
      'Barbarian': ['strength', 'constitution'],
      'Bard': ['dexterity', 'charisma'],
      'Druid': ['intelligence', 'wisdom'],
      'Monk': ['strength', 'dexterity'],
      'Sorcerer': ['constitution', 'charisma'],
      'Warlock': ['wisdom', 'charisma']
    };

    const isProficient = classSaveProficiencies[character.class]?.includes(ability) || false;
    
    return modifier + (isProficient ? profBonus : 0);
  };

  const getSkillModifier = (skill) => {
    const skillAbilities = {
      'Acrobatics': 'dexterity',
      'Animal Handling': 'wisdom',
      'Arcana': 'intelligence',
      'Athletics': 'strength',
      'Deception': 'charisma',
      'History': 'intelligence',
      'Insight': 'wisdom',
      'Intimidation': 'charisma',
      'Investigation': 'intelligence',
      'Medicine': 'wisdom',
      'Nature': 'intelligence',
      'Perception': 'wisdom',
      'Performance': 'charisma',
      'Persuasion': 'charisma',
      'Religion': 'intelligence',
      'Sleight of Hand': 'dexterity',
      'Stealth': 'dexterity',
      'Survival': 'wisdom'
    };

    const ability = skillAbilities[skill];
    const modifier = getAbilityModifier(character[ability]);
    const profBonus = getProficiencyBonus();
    
    const isProficient = character.skills?.includes(skill) || false;
    
    return modifier + (isProficient ? profBonus : 0);
  };

  const handleEquipItem = (item, slot) => {
    if (!canEquipToSlot(item, slot)) {
      alert(`Cannot equip ${item.name} to ${EQUIPMENT_SLOTS[slot]}. Item type: ${item.type}`);
      return;
    }

    const equipment = getEquipment();
    const updatedEquipment = { ...equipment, [slot]: item };
    
    const updatedCharacter = {
      ...character,
      equipment: updatedEquipment
    };

    onUpdateCharacter(updatedCharacter);
    setShowEquipModal(false);
  };

  const handleUnequipItem = (slot) => {
    const equipment = getEquipment();
    const updatedEquipment = { ...equipment, [slot]: null };
    
    const updatedCharacter = {
      ...character,
      equipment: updatedEquipment
    };

    onUpdateCharacter(updatedCharacter);
  };

  const renderStats = () => {
    const abilities = [
      { name: 'Strength', key: 'strength' },
      { name: 'Dexterity', key: 'dexterity' },
      { name: 'Constitution', key: 'constitution' },
      { name: 'Intelligence', key: 'intelligence' },
      { name: 'Wisdom', key: 'wisdom' },
      { name: 'Charisma', key: 'charisma' }
    ];

    const skills = [
      'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics',
      'Deception', 'History', 'Insight', 'Intimidation',
      'Investigation', 'Medicine', 'Nature', 'Perception',
      'Performance', 'Persuasion', 'Religion', 'Sleight of Hand',
      'Stealth', 'Survival'
    ];

    return (
      <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#f5f5f5', padding: '16px', border: '1px solid #ccc' }}>
            <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Name</div>
            <div style={{ color: '#000', fontSize: '16px', fontWeight: '500' }}>{character.name}</div>
          </div>
          <div style={{ background: '#f5f5f5', padding: '16px', border: '1px solid #ccc' }}>
            <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Race</div>
            <div style={{ color: '#000', fontSize: '16px', fontWeight: '500' }}>{character.race}</div>
          </div>
          <div style={{ background: '#f5f5f5', padding: '16px', border: '1px solid #ccc' }}>
            <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Class</div>
            <div style={{ color: '#000', fontSize: '16px', fontWeight: '500' }}>{character.class}</div>
          </div>
          <div style={{ background: '#f5f5f5', padding: '16px', border: '1px solid #ccc' }}>
            <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Level</div>
            <div style={{ color: '#000', fontSize: '16px', fontWeight: '500' }}>{character.level}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#f5f5f5', padding: '20px', border: '1px solid #ccc' }}>
            <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Hit Points</div>
            <div style={{ color: '#000', fontSize: '24px', fontWeight: '500', marginBottom: '12px' }}>
              {character.hp} / {character.maxHp}
            </div>
            <div style={{ background: '#ddd', height: '8px', overflow: 'hidden' }}>
              <div style={{
                background: '#000',
                height: '100%',
                width: `${(character.hp / character.maxHp) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div style={{ background: '#f5f5f5', padding: '20px', border: '1px solid #ccc', textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Armor Class</div>
            <div style={{ color: '#000', fontSize: '24px', fontWeight: '500' }}>{getArmorClass()}</div>
          </div>

          <div style={{ background: '#f5f5f5', padding: '20px', border: '1px solid #ccc', textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Initiative</div>
            <div style={{ color: '#000', fontSize: '24px', fontWeight: '500' }}>
              {getAbilityModifier(character.dexterity) >= 0 ? '+' : ''}{getAbilityModifier(character.dexterity)}
            </div>
          </div>

          <div style={{ background: '#f5f5f5', padding: '20px', border: '1px solid #ccc', textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Speed</div>
            <div style={{ color: '#000', fontSize: '24px', fontWeight: '500' }}>{character.speed || 30} ft</div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ color: '#000', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontWeight: '600' }}>Ability Scores</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
            {abilities.map(({ name, key }) => (
              <div key={key} style={{ background: '#f5f5f5', padding: '16px', border: '1px solid #ccc', textAlign: 'center' }}>
                <div style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{name.substring(0, 3)}</div>
                <div style={{ color: '#000', fontSize: '20px', fontWeight: '500', marginBottom: '4px' }}>{character[key]}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {getAbilityModifier(character[key]) >= 0 ? '+' : ''}{getAbilityModifier(character[key])}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ color: '#000', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontWeight: '600' }}>Saving Throws</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {abilities.map(({ name, key }) => (
              <div key={key} style={{ background: '#f5f5f5', padding: '12px 16px', border: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{name}</div>
                <div style={{ color: '#000', fontSize: '16px', fontWeight: '500' }}>
                  {getSavingThrow(key) >= 0 ? '+' : ''}{getSavingThrow(key)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: '#000', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontWeight: '600' }}>Skills</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {skills.map(skill => (
              <div key={skill} style={{ background: '#f5f5f5', padding: '12px 16px', border: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{skill}</div>
                <div style={{ color: '#000', fontSize: '16px', fontWeight: '500' }}>
                  {getSkillModifier(skill) >= 0 ? '+' : ''}{getSkillModifier(skill)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEquipment = () => {
    const equipment = getEquipment();

    return (
      <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ color: '#000', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontWeight: '600' }}>Equipment Slots</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {Object.entries(EQUIPMENT_SLOTS).map(([slot, label]) => (
            <div key={slot} style={{ background: '#f5f5f5', padding: '16px', border: '1px solid #ccc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                {equipment[slot] && (
                  <button
                    onClick={() => handleUnequipItem(slot)}
                    style={{
                      background: '#000',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 8px',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: 'pointer'
                    }}
                  >
                    Unequip
                  </button>
                )}
              </div>
              {equipment[slot] ? (
                <div>
                  <div style={{ color: '#000', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                    {equipment[slot].name}
                  </div>
                  <div style={{ color: '#666', fontSize: '11px' }}>
                    {equipment[slot].description}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedSlot(slot);
                    setShowEquipModal(true);
                  }}
                  style={{
                    width: '100%',
                    background: '#fff',
                    border: '1px solid #ccc',
                    padding: '12px',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  Equip Item
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInventory = () => {
    return (
      <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ color: '#000', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Inventory</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            Gold: <span style={{ color: '#000', fontWeight: '500' }}>{character.gold}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {character.inventory && character.inventory.length > 0 ? (
            character.inventory.map((item, index) => (
              <div key={index} style={{ background: '#f5f5f5', padding: '16px', border: '1px solid #ccc' }}>
                <div style={{ color: '#000', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  {item.name}
                </div>
                <div style={{ color: '#666', fontSize: '11px', marginBottom: '8px' }}>
                  {item.description}
                </div>
                {item.price && (
                  <div style={{ color: '#666', fontSize: '10px' }}>
                    Value: {item.price} gp
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: '#999', fontSize: '14px' }}>
              No items in inventory
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        border: '2px solid #000',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          background: '#000',
          padding: '16px 24px',
          borderBottom: '2px solid #000',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
            Character Sheet
          </h2>
          <button
            style={{
              background: 'transparent',
              border: '2px solid #fff',
              color: '#fff',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              cursor: 'pointer'
            }}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', background: '#f5f5f5', borderBottom: '1px solid #ccc' }}>
          {['stats', 'equipment', 'inventory'].map(tab => (
            <button
              key={tab}
              style={{
                flex: 1,
                background: activeTab === tab ? '#fff' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
                color: activeTab === tab ? '#000' : '#666',
                padding: '12px 24px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'stats' && renderStats()}
          {activeTab === 'equipment' && renderEquipment()}
          {activeTab === 'inventory' && renderInventory()}
        </div>
      </div>

      {showEquipModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#fff',
            border: '2px solid #000',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                fontSize: '24px',
                lineHeight: 1,
                padding: 0,
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #000',
                background: 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => setShowEquipModal(false)}
            >
              ×
            </button>
            <h2 style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px', fontWeight: '600' }}>
              Equip to {EQUIPMENT_SLOTS[selectedSlot]}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {character.inventory && character.inventory.length > 0 ? (
                character.inventory
                  .filter(item => canEquipToSlot(item, selectedSlot))
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleEquipItem(item, selectedSlot)}
                      style={{
                        background: '#f5f5f5',
                        border: '1px solid #ccc',
                        padding: '16px',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ color: '#000', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        {item.name}
                      </div>
                      <div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>
                        {item.description}
                      </div>
                      <div style={{ color: '#999', fontSize: '10px' }}>
                        Type: {item.type}
                      </div>
                    </button>
                  ))
              ) : null}
              {!character.inventory || character.inventory.filter(item => canEquipToSlot(item, selectedSlot)).length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                  No compatible items in inventory
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterSheet;