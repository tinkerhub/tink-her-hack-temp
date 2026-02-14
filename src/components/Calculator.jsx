import React, { useState } from 'react';
import './Calculator.css';

const Calculator = ({ onUnlock, user }) => {
    const [display, setDisplay] = useState('');
    const [error, setError] = useState('');

    const handlePress = (val) => {
        if (val === '=') {
            try {
                const enteredCode = display + '=';

                // If user is logged in, check their specific code
                if (user) {
                    if (user.secret_code === enteredCode) {
                        onUnlock(enteredCode);
                        setDisplay('');
                        setError('');
                    } else {
                        setError('Wrong code!');
                        setDisplay('');
                        setTimeout(() => setError(''), 2000);
                    }
                } else {
                    // No user logged in, use default code or just unlock
                    if (enteredCode === '1234=') {
                        onUnlock(enteredCode);
                        setDisplay('');
                        setError('');
                    } else {
                        // Try to evaluate as math
                        setDisplay(eval(display).toString());
                    }
                }
            } catch (e) {
                setDisplay('Error');
                setTimeout(() => setDisplay(''), 1000);
            }
        } else if (val === 'C') {
            setDisplay('');
            setError('');
        } else {
            setDisplay(display + val);
        }
    };

    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        'C', '0', '=', '+'
    ];

    return (
        <div className="calculator-container">
            <div className="calculator-display">{display || (error ? error : '0')}</div>
            <div className="calculator-grid">
                {buttons.map((btn) => (
                    <button key={btn} onClick={() => handlePress(btn)} className="calc-btn">
                        {btn}
                    </button>
                ))}
            </div>
            {user ? (
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem', color: '#888' }}>
                    Welcome back, {user.username}! Enter your secret code.
                </p>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '10px' }}>
                        Not signed in yet?
                    </p>
                    <button
                        onClick={() => onUnlock('1234=')}
                        style={{
                            background: 'linear-gradient(135deg, var(--primary-color), #ff6b9d)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '25px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(255, 143, 163, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(255, 143, 163, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(255, 143, 163, 0.3)';
                        }}
                    >
                        Next →
                    </button>
                    <p style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '10px' }}>
                        💡 Hint: Or enter 1234= on the calculator
                    </p>
                </div>
            )}
        </div>
    );
};

export default Calculator;
