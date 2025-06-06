import React, { useState, useMemo } from "react";

// PUBLIC_INTERFACE
/**
 * Main Container for NoteEase app: supports creating, editing, deleting, categorizing, and searching notes.
 * Uses in-memory state; real app could replace with backend API.
 */
function NoteEaseMain() {
  // State for notes, categories, selection, filtering, etc.
  const [notes, setNotes] = useState([
    // Demo notes to start with
    {
      id: 1,
      title: "Welcome to NoteEase!",
      content: "You can create, edit, delete, categorize, and search notes.",
      category: "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);
  const [categories, setCategories] = useState(["General", "Work", "Personal", "Ideas"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // or 'edit' or 'create'
  const [activeNote, setActiveNote] = useState(null);

  // Handle opening modal (for edit/create)
  const openModal = (mode, note) => {
    setModalMode(mode);
    setActiveNote(mode === "create"
      ? { id: null, title: "", content: "", category: categories[0] || "General" }
      : { ...note });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveNote(null);
    setModalMode("view");
  };

  // Handle create
  const handleCreate = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    if (!categories.includes(note.category)) {
      setCategories([...categories, note.category]);
    }
    closeModal();
  };

  // Handle edit
  const handleEdit = (note) => {
    setNotes(notes.map((n) => (n.id === note.id ? { ...note, updatedAt: new Date() } : n)));
    if (!categories.includes(note.category)) {
      setCategories([...categories, note.category]);
    }
    closeModal();
  };

  // Handle delete
  const handleDelete = (note) => {
    setNotes(notes.filter((n) => n.id !== note.id));
    closeModal();
  };

  // Handle category filters and search
  const filteredNotes = useMemo(() => {
    let items = [...notes];
    if (selectedCategory) {
      items = items.filter((n) => n.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return items.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, selectedCategory, searchTerm]);

  // Add styled-components-like styles with vanilla CSS-in-JS for isolated quick styling
  const styles = {
    container: {
      maxWidth: 900,
      margin: "0 auto",
      padding: "32px 16px 64px 16px",
      background: "#FFFFFF",
      minHeight: "100vh",
      fontFamily: "'Inter','Roboto','Helvetica','Arial',sans-serif",
      position: "relative",
      color: "#222",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    title: {
      fontSize: "2.25rem",
      color: "#1976D2",
      fontWeight: 700,
    },
    searchInput: {
      padding: "8px 12px",
      fontSize: "1rem",
      border: "1.5px solid #1976D2",
      borderRadius: 4,
      background: "#fff",
      color: "#222",
      outline: "none",
      width: 220,
    },
    chipRow: {
      display: "flex",
      gap: "12px",
      marginBottom: 18,
      flexWrap: "wrap",
    },
    chip: (active) => ({
      fontSize: "0.98rem",
      borderRadius: 20,
      padding: "7px 18px",
      cursor: "pointer",
      border: active ? "2px solid #1976D2" : "1.2px solid #ddd",
      background: active ? "#1976D2" : "#F5F8FB",
      color: active ? "#fff" : "#1976D2",
      fontWeight: 500,
      transition: "all 0.15s",
      outline: "none",
    }),
    noteList: {
      marginTop: 6,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
      gap: "22px",
    },
    noteCard: {
      background: "#fff",
      border: "1.3px solid #e3e5e7",
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(25, 118, 210, 0.06)",
      cursor: "pointer",
      padding: "18px 18px 15px 18px",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.16s",
      position: "relative",
      minHeight: 120,
      overflow: "hidden",
    },
    noteTitle: {
      fontWeight: 650,
      fontSize: "1.1rem",
      color: "#1976D2",
      marginBottom: "0.4em",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    noteSnippet: {
      color: "#222",
      fontSize: "1rem",
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical"
    },
    noteMeta: {
      fontSize: "0.9em",
      color: "#888",
      marginTop: 6,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    fab: {
      position: "fixed",
      bottom: 36,
      right: 44,
      zIndex: 2000,
      background: "#1976D2",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: 64,
      height: 64,
      boxShadow: "0 4px 16px rgba(25, 118, 210, 0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2.1rem",
      cursor: "pointer",
      transition: "background 0.17s",
    },
    modalBackdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(32,44,80,0.20)",
      zIndex: 3000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modal: {
      background: "#fff",
      borderRadius: 15,
      width: 360,
      maxWidth: "96vw",
      boxShadow: "0 6px 24px rgba(25,118,210,0.16)",
      padding: "30px 24px 24px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 18,
    },
    modalTitle: {
      fontWeight: 600,
      fontSize: "1.3rem",
      color: "#1976D2",
      marginBottom: 4,
    },
    input: {
      fontSize: "1rem",
      padding: "10px 10px",
      borderRadius: 4,
      border: "1.4px solid #B0BEC5",
      margin: "1px 0 6px 0",
      background: "#F0F3F7",
      outline: "none",
      color: "#164D91",
      fontWeight: 500,
      width: "100%",
    },
    textarea: {
      fontSize: "1.04rem",
      padding: "10px",
      borderRadius: 4,
      border: "1.3px solid #B0BEC5",
      background: "#F0F3F7",
      outline: "none",
      minHeight: 80,
      marginBottom: 8,
      color: "#1C3970",
      width: "100%",
      resize: "vertical",
    },
    modalActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 14,
      marginTop: 7,
    },
    actionBtn: (accent) => ({
      background: accent ? "#FFC107" : "#1976D2",
      color: "#fff",
      border: "none",
      borderRadius: 5,
      padding: "8px 20px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "1.04rem",
      boxShadow: "0 2px 6px rgba(25,118,210,0.08)",
      marginLeft: 4,
      outline: "none",
      transition: "background 0.12s",
    }),
    dangerBtn: {
      background: "#E53935",
      color: "#fff",
      border: "none",
      borderRadius: 5,
      padding: "8px 18px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "1.01rem",
      boxShadow: "0 1px 4px rgba(229,57,53,0.09)",
      marginLeft: 4,
      outline: "none",
      transition: "background 0.12s",
    }
  };

  // Note modal implementation (view, edit, create)
  function NoteModal({ open, note, mode, onClose, onSave, onDelete, categories, onCategoryAdd }) {
    const [localNote, setLocalNote] = useState(note || { title: "", content: "", category: categories[0] || "" });
    const [newCategory, setNewCategory] = useState("");

    // keep localNote in sync
    React.useEffect(() => {
      setLocalNote(note || { title: "", content: "", category: categories[0] || "" });
    }, [note, open, categories]);

    const handleInput = (e) => setLocalNote({ ...localNote, [e.target.name]: e.target.value });

    const handleCategoryChange = (e) => setLocalNote({ ...localNote, category: e.target.value });

    const handleCategoryAdd = () => {
      if (newCategory.trim() && !categories.includes(newCategory.trim())) {
        onCategoryAdd(newCategory.trim());
        setLocalNote({ ...localNote, category: newCategory.trim() });
        setNewCategory("");
      }
    };

    if (!open) return null;
    return (
      <div style={styles.modalBackdrop} tabIndex={-1} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <div style={styles.modalTitle}>
            {mode === "create"
              ? "New Note"
              : mode === "edit"
                ? "Edit Note"
                : "Note Preview"}
          </div>
          {/* Title */}
          {mode === "view" ? (
            <div>
              <div style={{
                ...styles.noteTitle,
                fontWeight: 700, fontSize: "1.22rem",
                marginBottom: 7
              }}>
                {note?.title}
              </div>
              <div style={{color: "#444", whiteSpace: "pre-wrap", minHeight: 60}}>{note?.content}</div>
              <div style={styles.noteMeta}>
                <span style={{
                  background: "#ECEFF1",
                  borderRadius: 12, color: "#1976D2", padding: "2px 12px", fontSize: "0.97em"
                }}>{note?.category}</span>
                <span>
                  {note?.updatedAt && ("Edited " + new Date(note.updatedAt).toLocaleString())}
                </span>
              </div>
            </div>
          ) : (
            <>
              <input
                style={styles.input}
                autoFocus
                placeholder="Note Title"
                name="title"
                value={localNote.title}
                maxLength={80}
                onChange={handleInput}
              />
              <textarea
                style={styles.textarea}
                placeholder="Type your note here..."
                name="content"
                value={localNote.content}
                maxLength={3000}
                onChange={handleInput}
              />
              <label>
                <span style={{marginRight: 8}}>Category:</span>
                <select
                  style={{...styles.input, width: 148, display: "inline-block"}}
                  name="category"
                  value={localNote.category}
                  onChange={handleCategoryChange}
                >
                  {categories.map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <div style={{marginTop: 7}}>
                <input
                  type="text"
                  placeholder="Add new category"
                  value={newCategory}
                  style={{...styles.input, width: 140, marginRight: 8, display: "inline-block"}}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleCategoryAdd(); }}
                />
                <button
                  style={styles.actionBtn(true)}
                  onClick={handleCategoryAdd}
                  type="button"
                  tabIndex={0}
                >Add</button>
              </div>
            </>
          )}

          <div style={styles.modalActions}>
            {mode === "edit" || mode === "create" ? (
              <>
                <button
                  style={styles.actionBtn(false)}
                  onClick={() => {
                    if (localNote.title.trim()) {
                      mode === "edit"
                        ? onSave({ ...note, ...localNote })
                        : onSave(localNote);
                    }
                  }}
                >
                  {mode === "edit" ? "Save" : "Create"}
                </button>
                <button style={styles.actionBtn(true)} onClick={onClose}>Cancel</button>
                {mode === "edit" &&
                  <button
                    style={styles.dangerBtn}
                    onClick={() => window.confirm("Delete this note?") && onDelete(note)}
                  >Delete</button>
                }
              </>
            ) : (
              <>
                <button style={styles.actionBtn(false)} onClick={onClose}>Close</button>
                <button style={styles.actionBtn(true)}
                  onClick={() => setModalMode("edit")}
                >Edit</button>
                <button
                  style={styles.dangerBtn}
                  onClick={() => window.confirm("Delete this note?") && onDelete(note)}
                >Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>NoteEase</div>
        <input
          style={styles.searchInput}
          type="search"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="Search notes"
        />
      </div>

      {/* Filter chips for categories */}
      <div style={styles.chipRow}>
        <span
          style={styles.chip(selectedCategory === "")}
          tabIndex={0}
          onClick={() => setSelectedCategory("")}
        >All</span>
        {categories.map(c =>
          <span
            key={c}
            style={styles.chip(selectedCategory === c)}
            tabIndex={0}
            onClick={() => setSelectedCategory(c)}
          >{c}</span>
        )}
      </div>

      {/* Notes list */}
      <div style={styles.noteList}>
        {filteredNotes.map(note => (
          <div
            style={styles.noteCard}
            key={note.id}
            title={note.title}
            tabIndex={0}
            onClick={() => openModal("view", note)}
          >
            <div style={styles.noteTitle}>{note.title}</div>
            <div style={styles.noteSnippet}>
              {note.content.length > 80
                ? note.content.substring(0, 78) + "…"
                : note.content}
            </div>
            <div style={styles.noteMeta}>
              <span style={{background:"#FFC107", color:"#222", borderRadius:10, padding:"2px 10px"}}>
                {note.category}
              </span>
              <span style={{fontSize:"0.93em"}}>
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 &&
          <div style={{
            color: "#888",
            fontSize: "1.1rem",
            textAlign: "center",
            gridColumn: "1/-1",
            padding: "55px 0 40px 0"
          }}>
            No notes found.
          </div>
        }
      </div>

      {/* Floating Action Button */}
      <button
        style={styles.fab}
        aria-label="Add note"
        title="Add note"
        onClick={() => openModal("create")}
      >+</button>

      {/* Note Modal */}
      <NoteModal
        open={modalOpen}
        note={activeNote}
        mode={modalMode}
        onClose={closeModal}
        onSave={modalMode === "edit"
          ? handleEdit
          : handleCreate}
        onDelete={handleDelete}
        categories={categories}
        onCategoryAdd={(cat) => setCategories([...categories, cat])}
      />
    </div>
  );
}

export default NoteEaseMain;
