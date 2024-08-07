import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

type MultiSelectDropdownProps = {
  options: string[];
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
  label: string;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedOptions,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleOptionChange = useCallback(
    (option: string) => {
      const updatedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((selected) => selected !== option)
        : [...selectedOptions, option];
      onChange(updatedOptions);
    },
    [selectedOptions, onChange]
  );

  const handleSelectAll = useCallback(() => {
    onChange(options);
  }, [options, onChange]);

  const handleDeselectAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const isAllSelected = useMemo(
    () => selectedOptions.length === options.length,
    [selectedOptions, options]
  );
  const isNoneSelected = useMemo(
    () => selectedOptions.length === 0,
    [selectedOptions]
  );

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggleDropdown}
        aria-expanded={isOpen}
        aria-controls="dropdown-menu"
      >
        {label}
      </button>
      {isOpen && (
        <div id="dropdown-menu" className="dropdown-menu">
          {/* <div className="dropdown-item">
            <input
              type="checkbox"
              id="checkbox-select-all"
              checked={isAllSelected}
              onChange={isAllSelected ? handleDeselectAll : handleSelectAll}
            />
            <label htmlFor="checkbox-select-all">Select All</label>
          </div> */}
          <div className="dropdown-item">
            <input
              type="checkbox"
              id="checkbox-deselect-all"
              checked={isNoneSelected}
              onChange={isNoneSelected ? handleSelectAll : handleDeselectAll}
            />
            <label htmlFor="checkbox-deselect-all">Deselect All</label>
          </div>
          {options.map((option) => (
            <div key={option} className="dropdown-item">
              <input
                type="checkbox"
                id={`checkbox-${option}`}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
              />
              <label htmlFor={`checkbox-${option}`}>{option}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(MultiSelectDropdown);
