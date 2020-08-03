import React from 'react';

function SelectUserName(props) {
  return (
    <div className="selectUserName">
    <h3>Set Username</h3>
        <div className="name-input">
            <input type="text" name="name" value={props.user} onChange={e => {localStorage.setItem('userData', e.target.value);
            props.setUser(e.target.value)}}/>
        </div>
    </div>
  );
}

export default SelectUserName;