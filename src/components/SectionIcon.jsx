import {
  Cookie, BowlFood, Lightning, Gift, Heart, Package
} from '@phosphor-icons/react';

const iconMap = {
  cookie:     Cookie,
  'bowl-food': BowlFood,
  lightning:  Lightning,
  gift:       Gift,
  heart:      Heart,
};

const colorMap = {
  cookie:     '#92400e',
  'bowl-food': '#b45309',
  lightning:  '#ca8a04',
  gift:       '#7c3aed',
  heart:      '#059669',
};

const bgMap = {
  cookie:     '#fef3c7',
  'bowl-food': '#fff7ed',
  lightning:  '#fefce8',
  gift:       '#f5f3ff',
  heart:      '#ecfdf5',
};

export default function SectionIcon({ icon, size = 20 }) {
  const Icon = iconMap[icon] || Package;
  const color = colorMap[icon] || '#6b7280';
  const bg = bgMap[icon] || '#f9fafb';

  return (
    <div style={{
      width: size + 16,
      height: size + 16,
      borderRadius: 10,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={size} weight="duotone" color={color} />
    </div>
  );
}

export function SectionIconRaw({ icon, size = 20, color: colorOverride }) {
  const Icon = iconMap[icon] || Package;
  const c = colorOverride || colorMap[icon] || '#6b7280';
  return <Icon size={size} weight="duotone" color={c} />;
}
