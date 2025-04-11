function ContactForm() {
    const [dispos, setDispos] = React.useState([]);
    const [successMsg, setSuccessMsg] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    const dateInputRef = React.useRef(null);
  
    const addDispo = () => {
      const fp = dateInputRef.current._flatpickr;
      const selectedDate = fp.selectedDates[0];
      if (!selectedDate) return;
  
      const label = selectedDate.toLocaleString("fr-FR", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
  
      const newDispo = {
        jour: selectedDate.toLocaleDateString("fr-FR"),
        heure: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
        label,
      };
  
      setDispos([...dispos, newDispo]);
    };
  
    const removeDispo = (index) => {
      const newList = [...dispos];
      newList.splice(index, 1);
      setDispos(newList);
    };
  
    React.useEffect(() => {
      flatpickr(dateInputRef.current, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        time_24hr: true,
        locale: "fr",
      });
    }, []);
  
    React.useEffect(() => {
      const input = document.getElementById("disponibilites-input");
      if (input) {
        input.value = JSON.stringify(dispos);
      }
    }, [dispos]);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setErrorMsg("");
      
        const form = document.getElementById("contact-form");
        const formData = new FormData(form);
      
        // Debug what's in FormData
        console.log("Form data contents:");
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
      
        try {
          console.log("Sending request to ./submit.php");
          const response = await fetch("./submit.php", {
            method: "POST",
            body: formData,
          });
          
          console.log("Response status:", response.status);
          
          // Try to get the text first to see what's actually returned
          const responseText = await response.text();
          console.log("Raw response:", responseText);
          
          // Now try to parse it as JSON
          try {
            const result = JSON.parse(responseText);
            console.log("Parsed result:", result);
            
            if (result.success) {
              setSuccessMsg("✅ Message envoyé avec succès !");
              setDispos([]);
              form.reset();
              dateInputRef.current._flatpickr.clear();
            } else {
              setErrorMsg(result.message || "❌ Une erreur s'est produite.");
            }
          } catch (jsonErr) {
            console.error("Failed to parse JSON:", jsonErr);
            setErrorMsg("❌ Réponse du serveur invalide: " + responseText.substring(0, 100));
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setErrorMsg("❌ Erreur de connexion au serveur: " + err.message);
        }
      };
  
    return (
      <div className="container">
        <form onSubmit={handleSubmit} id="contact-form">
          <div className="form-box">
            <div className="form-left">
              <h1>Contactez l’agence</h1>
  
              {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}
              {successMsg && <div style={{ color: "green" }}>{successMsg}</div>}
  
              <h3>Vos coordonnées</h3>
              <div className="civilite">
                <label><input type="radio" name="civilite" value="Mme" required /> Mme</label>
                <label><input type="radio" name="civilite" value="M" /> M</label>
              </div>
  
              <div className="input-row">
                <input type="text" name="nom" placeholder="Nom" required />
                <input type="text" name="prenom" placeholder="Prénom" required />
              </div>
  
              <input type="email" name="email" placeholder="Adresse mail" required />
              <input type="tel" name="telephone" placeholder="Téléphone" required />
  
              <h3>Disponibilités pour une visite</h3>
              <div className="dispos-row">
                <input ref={dateInputRef} type="text" placeholder="Choisir une date et heure" />
                <button type="button" onClick={addDispo}>AJOUTER DISPO</button>
              </div>
  
              <ul id="dispo-list">
                {dispos.map((d, i) => (
                  <li key={i}>
                    {d.label} <button type="button" onClick={() => removeDispo(i)}>X</button>
                  </li>
                ))}
              </ul>
            </div>
  
            <div className="form-right">
              <h3>Votre message</h3>
              <div className="radio-group">
                <label><input type="radio" name="type_message" value="Demande de visite" required /> Demande de visite</label>
                <label><input type="radio" name="type_message" value="Être rappelé" /> Être rappelé</label>
                <label><input type="radio" name="type_message" value="Plus de photos" /> Plus de photos</label>
              </div>
              <textarea name="message" placeholder="Votre message" required></textarea>
              <button type="submit" className="submit-btn">ENVOYER</button>
            </div>
          </div>
          <input type="hidden" name="disponibilites" id="disponibilites-input" />
        </form>
      </div>
    );
  }
  
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<ContactForm />);
  