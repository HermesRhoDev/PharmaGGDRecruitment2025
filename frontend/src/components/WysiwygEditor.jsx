'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { createEditor, Transforms, Editor, Text, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';

// Définition des types de blocs
const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

// Valeur par défaut pour l'éditeur
const DEFAULT_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

// Fonction pour parser la valeur d'entrée
const parseValue = (value) => {
  if (!value) return DEFAULT_VALUE;
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Vérifier que chaque élément a la structure correcte
        const isValid = parsed.every(node => 
          node && typeof node === 'object' && 
          node.children && Array.isArray(node.children)
        );
        return isValid ? parsed : DEFAULT_VALUE;
      }
    } catch {
      // Si ce n'est pas du JSON valide, créer un paragraphe avec le texte
      return [
        {
          type: 'paragraph',
          children: [{ text: value }],
        },
      ];
    }
  }
  
  return DEFAULT_VALUE;
};

// Composant pour les boutons de la barre d'outils
const Button = ({ active, onMouseDown, children, ...props }) => (
  <button
    {...props}
    type="button"
    className={`wysiwyg-button ${active ? 'active' : ''}`}
    onMouseDown={onMouseDown}
  >
    {children}
  </button>
);

// Composant pour les icônes
const Icon = ({ children }) => <span className="wysiwyg-icon">{children}</span>;

// Boutons de formatage
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

// Barre d'outils
const Toolbar = () => (
  <div className="wysiwyg-toolbar">
    <MarkButton format="bold" icon="B" />
    <MarkButton format="italic" icon="I" />
    <MarkButton format="underline" icon="U" />
    <div className="wysiwyg-separator" />
    <BlockButton format="heading-one" icon="H1" />
    <BlockButton format="heading-two" icon="H2" />
    <div className="wysiwyg-separator" />
    <BlockButton format="numbered-list" icon="1." />
    <BlockButton format="bulleted-list" icon="•" />
    <div className="wysiwyg-separator" />
    <BlockButton format="left" icon="⇤" />
    <BlockButton format="center" icon="⇔" />
    <BlockButton format="right" icon="⇥" />
  </div>
);

// Fonctions utilitaires
const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// Composants de rendu
const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

// Composant principal
const WysiwygEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Entrez votre description...', 
  maxLength = 10000,
  error = null 
}) => {
  // Créer l'éditeur une seule fois
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
  // Parser la valeur initiale une seule fois
  const initialValue = useMemo(() => parseValue(value), []);
  
  // État pour suivre la valeur actuelle
  const [currentValue, setCurrentValue] = useState(initialValue);

  // Synchroniser avec la valeur externe seulement si elle change vraiment
  useEffect(() => {
    const newValue = parseValue(value);
    const currentSerialized = JSON.stringify(currentValue);
    const newSerialized = JSON.stringify(newValue);
    
    if (currentSerialized !== newSerialized) {
      setCurrentValue(newValue);
      // Réinitialiser l'éditeur avec la nouvelle valeur
      editor.children = newValue;
      editor.onChange();
    }
  }, [value, currentValue, editor]);

  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const handleChange = useCallback((newValue) => {
    setCurrentValue(newValue);
    
    // Convertir en JSON pour le stockage
    const serialized = JSON.stringify(newValue);
    onChange?.(serialized);
  }, [onChange]);

  // Calculer le nombre de caractères
  const getTextLength = (nodes) => {
    return nodes.reduce((length, node) => {
      if (Text.isText(node)) {
        return length + node.text.length;
      } else if (node.children) {
        return length + getTextLength(node.children);
      }
      return length;
    }, 0);
  };

  const textLength = getTextLength(currentValue);

  return (
    <div className={`wysiwyg-editor ${error ? 'error' : ''}`}>
      <Slate 
        editor={editor} 
        initialValue={initialValue} 
        value={currentValue}
        onChange={handleChange}
      >
        <Toolbar />
        <div className="wysiwyg-content">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            className="wysiwyg-editable"
          />
        </div>
      </Slate>
      
      <div className="wysiwyg-footer">
        <div className="wysiwyg-counter">
          <span className={textLength > maxLength ? 'error' : ''}>
            {textLength}/{maxLength}
          </span>
        </div>
        {error && <div className="wysiwyg-error">{error}</div>}
      </div>
    </div>
  );
};

export default WysiwygEditor;