import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  Activity, Bell, CalendarClock, CheckCircle2, ChevronRight,
  Dumbbell, Menu, ShieldCheck, Smartphone, X, Zap
} from 'lucide-react';

const isNative = () => Capacitor.isNativePlatform();

function BeeLogo({ small = false }) {
  return <img className={small ? 'bee-logo small' : 'bee-logo'} src={`${import.meta.env.BASE_URL}bee.svg`} alt="Abelha FitZone" />;
}

export default function App() {
  const [permission, setPermission] = useState('Não verificada');
  const [message, setMessage] = useState('Hora do treino de pernas! Não desista!');
  const [status, setStatus] = useState('Seu próximo treino começa com uma decisão.');
  const [pending, setPending] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNative()) refreshPending();
  }, []);

  async function ensurePermission() {
    if (!isNative()) {
      setStatus('Notificações nativas funcionam no APK Android. No site, você pode conhecer e editar seu lembrete.');
      return false;
    }
    try {
      let result = await LocalNotifications.checkPermissions();
      if (result.display !== 'granted') result = await LocalNotifications.requestPermissions();
      setPermission(result.display === 'granted' ? 'Concedida' : 'Negada');
      if (result.display !== 'granted') setStatus('Permissão não concedida. Ative as notificações nas configurações do Android.');
      return result.display === 'granted';
    } catch (error) {
      setStatus(`Não foi possível verificar a permissão: ${error.message}`);
      return false;
    }
  }

  async function prepareChannel() {
    if (Capacitor.getPlatform() === 'android') {
      await LocalNotifications.createChannel({
        id: 'fitzone_training',
        name: 'Lembretes FitZone',
        description: 'Alertas motivacionais e lembretes de treino',
        importance: 4,
        sound: 'fitzone_alert.wav',
        vibration: true,
        visibility: 1
      });
    }
  }

  async function sendNow() {
    if (!message.trim()) {
      setStatus('Escreva uma mensagem antes de enviar.');
      return;
    }
    setLoading(true);
    try {
      if (!(await ensurePermission())) return;
      await prepareChannel();
      await LocalNotifications.schedule({ notifications: [{
        id: Math.floor(Date.now() % 2147483000),
        title: 'FitZone • Hora de se movimentar!',
        body: message.trim(),
        channelId: 'fitzone_training',
        schedule: { at: new Date(Date.now() + 1000) }
      }]});
      setStatus('Notificação enviada! Confira a central de notificações do celular.');
      await refreshPending();
    } catch (error) {
      setStatus(`Erro ao enviar a notificação: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function scheduleIn(seconds) {
    if (!message.trim()) {
      setStatus('Escreva uma mensagem antes de agendar.');
      return;
    }
    setLoading(true);
    try {
      if (!(await ensurePermission())) return;
      await prepareChannel();
      await LocalNotifications.schedule({ notifications: [{
        id: Math.floor(Date.now() % 2147483000),
        title: 'FitZone • Seu lembrete de treino',
        body: message.trim(),
        channelId: 'fitzone_training',
        schedule: { at: new Date(Date.now() + seconds * 1000) }
      }]});
      setStatus(`Pronto! Seu lembrete foi agendado para daqui a ${seconds} segundos.`);
      await refreshPending();
    } catch (error) {
      setStatus(`Erro ao agendar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function refreshPending() {
    if (!isNative()) return;
    try {
      const result = await LocalNotifications.getPending();
      setPending(result.notifications || []);
    } catch { /* mantém a interface utilizável */ }
  }

  async function cancelOne(id) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
      setStatus('Lembrete cancelado.');
      await refreshPending();
    } catch (error) {
      setStatus(`Não foi possível cancelar: ${error.message}`);
    }
  }

  async function checkPermission() {
    if (!isNative()) {
      setStatus('Abra o aplicativo instalado no Android para verificar a permissão nativa.');
      return;
    }
    try {
      const result = await LocalNotifications.checkPermissions();
      setPermission(result.display === 'granted' ? 'Concedida' : 'Não concedida');
      setStatus(`Permissão atual: ${result.display}.`);
    } catch (error) {
      setStatus(`Erro: ${error.message}`);
    }
  }

  const nav = <><a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a><a href="#experiencia" onClick={() => setMenuOpen(false)}>Experiência</a><a href="#lembretes" onClick={() => setMenuOpen(false)}>Lembretes</a><a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a></>;

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#inicio"><BeeLogo small /><span>FIT<span className="yellow">ZONE</span></span></a>
        <nav className="desktop-nav">{nav}</nav>
        <a className="header-cta" href="#lembretes">Começar agora <ChevronRight size={17}/></a>
        <button className="menu-toggle" aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>
      {menuOpen && <nav className="mobile-nav">{nav}</nav>}

      <main>
        <section className="hero section-wrap" id="inicio">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot"/> SUA ROTINA. SUA FORÇA. SUA CONQUISTA.</div>
            <h1>DISCIPLINA HOJE.<br/><span>RESULTADOS</span><br/>AMANHÃ.</h1>
            <p className="hero-text">A evolução acontece quando você aparece por si. Organize seus lembretes, mantenha o foco e transforme intenção em constância.</p>
            <div className="hero-actions">
              <a className="button button-yellow" href="#lembretes">Programar meu treino <ChevronRight size={18}/></a>
              <a className="text-link" href="#experiencia">Conheça a FitZone <span>↓</span></a>
            </div>
            <div className="hero-proof"><span><CheckCircle2 size={16}/> Foco no seu ritmo</span><span><CheckCircle2 size={16}/> Lembretes personalizados</span></div>
          </div>
          <div className="hero-art">
            <div className="art-circle"></div>
            <div className="bee-emblem"><BeeLogo/><div className="emblem-name">FITZONE</div><div className="emblem-caption">FORÇA • FOCO • CONSTÂNCIA</div></div>
            <div className="float-note note-top"><Zap size={18}/><span><b>VÁ ALÉM</b><small>Um treino por vez.</small></span></div>
            <div className="float-note note-bottom"><Activity size={19}/><span><b>SUA EVOLUÇÃO</b><small>Começa agora.</small></span></div>
          </div>
        </section>

        <section className="ticker"><span>FORÇA</span><i>✳</i><span>FOCO</span><i>✳</i><span>CONSTÂNCIA</span><i>✳</i><span>SUPERE SEUS LIMITES</span></section>

        <section className="experience section-wrap" id="experiencia">
          <div className="section-title"><span className="eyebrow">A EXPERIÊNCIA FITZONE</span><h2>SEU FOCO MERECE<br/><span>UM PLANO.</span></h2><p>Ferramentas simples para você manter seus objetivos sempre por perto.</p></div>
          <div className="feature-grid">
            <article className="feature-card"><div className="feature-icon"><Bell/></div><h3>Lembretes que motivam</h3><p>Receba uma mensagem no momento certo para lembrar do compromisso que você assumiu consigo.</p></article>
            <article className="feature-card"><div className="feature-icon"><CalendarClock/></div><h3>Seu horário, suas regras</h3><p>Agende alertas rápidos e organize sua rotina de treino com praticidade.</p></article>
            <article className="feature-card"><div className="feature-icon"><ShieldCheck/></div><h3>Controle no dispositivo</h3><p>No aplicativo Android, as notificações locais são programadas pelo próprio aparelho.</p></article>
          </div>
        </section>

        <section className="reminder-section" id="lembretes">
          <div className="reminder-layout section-wrap">
            <div className="reminder-intro">
              <span className="eyebrow">CENTRAL FITZONE</span>
              <h2>SEU PRÓXIMO<br/><span>PASSO COMEÇA AQUI.</span></h2>
              <p>Personalize sua mensagem e escolha quando quer receber seu lembrete.</p>
              <div className="platform-note"><Smartphone size={19}/><span><b>Experiência completa no Android</b><small>Permita notificações quando o sistema solicitar.</small></span></div>
            </div>
            <div className="reminder-panel">
              <div className="panel-heading"><div className="panel-icon"><Bell/></div><div><h3>Seu lembrete de treino</h3><p>Uma mensagem feita para você.</p></div></div>
              <label htmlFor="motivation">MENSAGEM MOTIVACIONAL</label>
              <textarea id="motivation" maxLength={150} value={message} onChange={e => setMessage(e.target.value)} placeholder="Escreva sua mensagem..."/>
              <div className="char-count">{message.length}/150 caracteres</div>
              <button className="button button-dark full" onClick={sendNow} disabled={loading}><Bell size={17}/> {loading ? 'Processando...' : 'Enviar notificação agora'}</button>
              <div className="panel-divider"><span>OU AGENDE PARA</span></div>
              <div className="schedule-grid">
                {[5, 10, 15].map(seconds => <button key={seconds} className="time-option" onClick={() => scheduleIn(seconds)} disabled={loading}><b>{seconds}</b><span>segundos</span></button>)}
              </div>
              <div className="permission-row"><span>Permissão: <b>{permission}</b></span><button onClick={checkPermission}>Verificar</button></div>
              <div className="status-box" role="status"><span className="status-light"/>{status}</div>
              {isNative() && <div className="pending-list"><div className="pending-title"><b>Agendamentos pendentes</b><button onClick={refreshPending}>Atualizar</button></div>{pending.length === 0 ? <p>Nenhum lembrete pendente.</p> : pending.map(item => <div className="pending-item" key={item.id}><span>{item.title}</span><button onClick={() => cancelOne(item.id)}>Cancelar</button></div>)}</div>}
            </div>
          </div>
        </section>

        <section className="closing section-wrap" id="sobre"><BeeLogo/><div><span className="eyebrow">ACADEMIA FITZONE</span><h2>SEJA CONSTANTE.<br/><span>SEJA FITZONE.</span></h2></div><a className="button button-yellow" href="#inicio">Voltar ao topo ↑</a></section>
      </main>
      <footer className="footer"><a className="brand" href="#inicio"><BeeLogo small/><span>FIT<span className="yellow">ZONE</span></span></a><p>FORÇA • FOCO • CONSTÂNCIA</p><small>© 2026 Academia FitZone. Todos os direitos reservados.</small></footer>
    </div>
  );
}