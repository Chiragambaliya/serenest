import { SPECIALTY_GROUPS } from '../lib/specialties';

export default function SpecialtySelect({
  id,
  value,
  onChange,
  disabled = false,
  includeAll = false,
  allLabel = 'All specialties',
  className = 'input',
  ariaLabel,
  style,
}) {
  return (
    <select
      id={id}
      className={className}
      style={style}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
    >
      {includeAll ? <option value="all">{allLabel}</option> : null}
      {SPECIALTY_GROUPS.map((group) => (
        <optgroup key={group.id} label={group.label}>
          {group.specialties.map((specialty) => (
            <option key={specialty.id} value={specialty.id}>
              {specialty.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
