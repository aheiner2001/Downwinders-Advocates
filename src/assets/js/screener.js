function screenerLocale() {
  var el = document.getElementById('screener');
  return (el && el.getAttribute('data-locale') === 'es') ? 'es' : 'en';
}
function cbLocale() {
  var el = document.getElementById('cb');
  return (el && el.getAttribute('data-locale') === 'es') ? 'es' : 'en';
}

var screenerMsg = {
  en: {
    blankH: 'A couple are still blank',
    blankB: '<p>Answer all six and we will give you a read. If you are not sure about one, pick "I am not sure." That is a real answer here.</p>',
    mtcoH: 'Montana, Colorado, and Guam are not covered right now.',
    mtcoB: '<p>We would rather tell you straight. Those were taken out of the bill before it passed. A new bill to add them was introduced in July 2026, but it has not become law, and we are not going to sign you up for something that does not exist yet.</p><p>If there was <strong>uranium work</strong> in the family, that is a separate category and it may still apply no matter where you lived. Worth a call if so.</p>',
    notcovH: 'That part of Arizona or Nevada is not covered.',
    notcovB: '<p>Only certain counties qualify. Arizona is Coconino, Yavapai, Navajo, Apache, Gila, and Mohave. Nevada is Eureka, Lander, Lincoln, Nye, White Pine, and the northeast corner of Clark county only, the Moapa, Overton, Logandale, Bunkerville and Mesquite area. Phoenix, Tucson, and Las Vegas are not on the list.</p><p>Two things worth checking before you let this go. Did the family live somewhere else during those years? And was there any <strong>uranium work</strong>? That is a separate category with different rules.</p>',
    notlistedH: 'That diagnosis is not on any of the covered lists.',
    notlistedB: '<p>Prostate, cervical, testicular and uterine cancer, and Hodgkin\u2019s disease, are not on the downwinder list, the uranium worker list, or the Manhattan Project waste list. We would rather tell you that in two minutes than in a year.</p><p>If there is a <strong>second diagnosis</strong> in the family, or a different family member who was sick, that can be a completely different answer. That is worth a call.</p>',
    melanomaH: 'Melanoma is not on the covered list.',
    melanomaB: '<p>This is a hard one and we would rather say it now than in a year. Melanoma does not qualify under this program in any category.</p><p>If there is a second diagnosis in the family, that may be a different story.</p>',
    yearsH: 'The years are the problem here, not the place.',
    yearsB: '<p>The county is right, but the program is tied to a specific window. A person has to have been physically present for <strong>at least one year between January 21, 1951 and November 6, 1962</strong>, or for the entire month of July 1962. New Mexico reaches further back, to September 24, 1944, because of the Trinity test.</p><p>Someone who arrived after November 1962 does not qualify as a downwinder, in any covered county.</p><p>Two things still worth checking. Were a <strong>parent or grandparent</strong> there during those years? Their claim can pass to family. And was there any <strong>uranium work</strong>? That is a separate category and these dates do not apply to it.</p>',
    dunnoH: 'Let us look it up with you.',
    dunnoB: '<p>County lines are exactly where people rule themselves out by mistake, and it is the easiest thing in the world for us to check. Call and tell us the town. It takes about two minutes and it costs nothing.</p>',
    nofitH: 'Based on this, it does not look like a fit.',
    nofitB: '<p>The program is tied to specific places and specific work. If neither applies, there is probably nothing here.</p><p>If you are unsure where a parent or grandparent actually lived or worked in those years, that is worth ten minutes on the phone before you close the door on it.</p>',
    urH: 'It depends on the uranium question.',
    urB: '<p>The location does not qualify on its own, but uranium work is a separate route in. If anyone in the family mined, milled, or hauled ore, this could still apply. Ask the family, then call us.</p>',
    goodH: 'This looks worth a conversation.',
    goodB: '<p>You have the two things that matter most: a place or work history the program covers, and a health condition in a category it recognizes.</p>',
    datesPin: '<p><strong>The years are the one thing left to pin down.</strong> Presence has to fall between January 1951 and November 1962, or September 1944 in New Mexico. If you are not certain, do not guess. Old tax, school, church and voting records settle it, and finding them is the part we do.</p>',
    mpw: '<p><strong>Manhattan Project waste claims work differently.</strong> They pay $50,000 or $25,000 rather than $100,000, they use a longer condition list that includes bone and kidney cancer, and the illness has to have begun at least two years after exposure.</p>',
    urYes: '<p><strong>Worth knowing.</strong> Uranium workers are covered for lung and kidney conditions, not only cancer. Silicosis, pulmonary fibrosis, nephritis. A lot of families rule themselves out right here by mistake.</p>',
    survivor: '<p><strong>Worth knowing.</strong> A spouse, child, parent, or in some cases grandchild can file. Many families assume the door closed when their parent did. It did not.</p>',
    denied: '<p><strong>You mentioned a denial.</strong> That is often a paperwork gap rather than an eligibility problem. Bring the denial letter to the call.</p>',
    unsure: '<p>Some of your answers were "not sure," which is completely normal. We can sort those out on the phone.</p>',
    free: '<p><strong>You can do this yourself, for free.</strong> RESEP clinics help at no cost and plenty of families file with no company at all. If you would rather not chase forty years of records, that is what we are for.</p>',
    cta: 'Talk it through, (801) 210-6517',
    legal: 'This is a general read, not a decision. Only the Department of Justice decides who qualifies.'
  },
  es: {
    blankH: 'Todavía faltan algunas',
    blankB: '<p>Responda las seis y le daremos una lectura. Si no está seguro de una, elija "No estoy seguro." Esa es una respuesta válida aquí.</p>',
    mtcoH: 'Montana, Colorado y Guam no están cubiertos en este momento.',
    mtcoB: '<p>Preferimos decirle la verdad. Esos se sacaron del proyecto de ley antes de que pasara. Se presentó un nuevo proyecto para añadirlos en julio de 2026, pero no se ha convertido en ley, y no lo vamos a inscribir en algo que aún no existe.</p><p>Si hubo <strong>trabajo con uranio</strong> en la familia, esa es una categoría separada y aún puede aplicar sin importar dónde vivieron. Vale una llamada si es así.</p>',
    notcovH: 'Esa parte de Arizona o Nevada no está cubierta.',
    notcovB: '<p>Solo ciertos condados califican. Arizona es Coconino, Yavapai, Navajo, Apache, Gila y Mohave. Nevada es Eureka, Lander, Lincoln, Nye, White Pine, y solo el rincón noreste del condado de Clark, el área de Moapa, Overton, Logandale, Bunkerville y Mesquite. Phoenix, Tucson y Las Vegas no están en la lista.</p><p>Dos cosas vale revisar antes de dejarlo. ¿La familia vivió en otro lugar durante esos años? ¿Y hubo <strong>trabajo con uranio</strong>? Esa es una categoría separada con reglas distintas.</p>',
    notlistedH: 'Ese diagnóstico no está en ninguna de las listas cubiertas.',
    notlistedB: '<p>El cáncer de próstata, cuello uterino, testicular y uterino, y la enfermedad de Hodgkin, no están en la lista de downwinders, la de trabajadores del uranio ni la de desechos del Proyecto Manhattan. Preferimos decírselo en dos minutos que en un año.</p><p>Si hay un <strong>segundo diagnóstico</strong> en la familia, o otro familiar enfermo, eso puede ser una respuesta completamente distinta. Vale una llamada.</p>',
    melanomaH: 'El melanoma no está en la lista cubierta.',
    melanomaB: '<p>Esta es dura y preferimos decirlo ahora que en un año. El melanoma no califica bajo este programa en ninguna categoría.</p><p>Si hay un segundo diagnóstico en la familia, esa puede ser otra historia.</p>',
    yearsH: 'El problema aquí son los años, no el lugar.',
    yearsB: '<p>El condado es correcto, pero el programa está atado a una ventana específica. Una persona debe haber estado físicamente presente <strong>al menos un año entre el 21 de enero de 1951 y el 6 de noviembre de 1962</strong>, o todo el mes de julio de 1962. Nuevo México se remonta más atrás, al 24 de septiembre de 1944, por el ensayo Trinity.</p><p>Quien llegó después de noviembre de 1962 no califica como downwinder, en ningún condado cubierto.</p><p>Dos cosas aún vale revisar. ¿Estuvo un <strong>padre o abuelo</strong> allí durante esos años? Su reclamo puede pasar a la familia. ¿Y hubo <strong>trabajo con uranio</strong>? Esa es una categoría separada y estas fechas no le aplican.</p>',
    dunnoH: 'Busquémoslo juntos.',
    dunnoB: '<p>Las líneas de los condados son exactamente donde la gente se descarta por error, y es lo más fácil del mundo de revisar para nosotros. Llame y díganos el pueblo. Toma unos dos minutos y no cuesta nada.</p>',
    nofitH: 'Con base en esto, no parece encajar.',
    nofitB: '<p>El programa está atado a lugares específicos y trabajo específico. Si ninguno aplica, probablemente no hay nada aquí.</p><p>Si no está seguro de dónde vivió o trabajó un padre o abuelo en esos años, vale diez minutos por teléfono antes de cerrar la puerta.</p>',
    urH: 'Depende de la pregunta del uranio.',
    urB: '<p>La ubicación no califica por sí sola, pero el trabajo con uranio es otra vía. Si alguien en la familia minó, molió o transportó mineral, esto aún podría aplicar. Pregunte a la familia y luego llámenos.</p>',
    goodH: 'Esto parece valer una conversación.',
    goodB: '<p>Tiene las dos cosas que más importan: un lugar o historial laboral que el programa cubre, y una condición de salud en una categoría que reconoce.</p>',
    datesPin: '<p><strong>Los años son lo único que falta por precisar.</strong> La presencia debe caer entre enero de 1951 y noviembre de 1962, o septiembre de 1944 en Nuevo México. Si no está seguro, no adivine. Los registros viejos de impuestos, escuela, iglesia y votos lo resuelven, y encontrarlos es la parte que hacemos nosotros.</p>',
    mpw: '<p><strong>Los reclamos por desechos del Proyecto Manhattan funcionan distinto.</strong> Pagan $50,000 o $25,000 en lugar de $100,000, usan una lista de condiciones más larga que incluye cáncer de hueso y de riñón, y la enfermedad debe haber comenzado al menos dos años después de la exposición.</p>',
    urYes: '<p><strong>Vale saber.</strong> Los trabajadores del uranio están cubiertos por enfermedades de pulmón y riñón, no solo cáncer. Silicosis, fibrosis pulmonar, nefritis. Muchas familias se descartan aquí por error.</p>',
    survivor: '<p><strong>Vale saber.</strong> Un cónyuge, hijo, padre o en algunos casos nieto puede presentar. Muchas familias asumen que la puerta se cerró cuando falleció su padre. No fue así.</p>',
    denied: '<p><strong>Mencionó una denegación.</strong> A menudo es un vacío de papeleo más que un problema de elegibilidad. Traiga la carta de denegación a la llamada.</p>',
    unsure: '<p>Algunas de sus respuestas fueron "no estoy seguro," lo cual es completamente normal. Podemos aclarar eso por teléfono.</p>',
    free: '<p><strong>Puede hacer esto usted mismo, gratis.</strong> Las clínicas RESEP ayudan sin costo y muchas familias presentan sin ninguna empresa. Si preferiría no perseguir cuarenta años de registros, para eso estamos.</p>',
    cta: 'Hablemos, (801) 210-6517',
    legal: 'Esta es una lectura general, no una decisión. Solo el Departamento de Justicia decide quién califica.'
  }
};

var cbMsg = {
  en: {
    needH: 'We need a name and a phone number',
    needB: '<p>Ten digits is enough. If you would rather just call, the number is (801) 210-6517.</p>',
    got: function(first){ return '<h3>Got it, '+first+'.</h3><p>Someone will call you within one business day. If we miss you, we keep trying.</p><p>Nothing happens until you say so, and you can tell us to delete your number at any point.</p>'; }
  },
  es: {
    needH: 'Necesitamos un nombre y un número de teléfono',
    needB: '<p>Diez dígitos bastan. Si prefiere solo llamar, el número es (801) 210-6517.</p>',
    got: function(first){ return '<h3>Listo, '+first+'.</h3><p>Alguien le llamará en un día hábil. Si no lo alcanzamos, seguimos intentando.</p><p>No pasa nada hasta que usted lo diga, y puede pedirnos borrar su número en cualquier momento.</p>'; }
  }
};

var screenerEl = document.getElementById('screener');
if (screenerEl) {
  screenerEl.addEventListener('submit', function(e){
    e.preventDefault();
    var f=new FormData(e.target), out=document.getElementById('out');
    var place=f.get('place'), years=f.get('years'), ur=f.get('uranium'), ill=f.get('illness'), who=f.get('who'), prior=f.get('prior');
    var m = screenerMsg[screenerLocale()];
    if(!place||!years||!ur||!ill||!who||!prior){
      out.className='result on';
      out.innerHTML='<h3>'+m.blankH+'</h3>'+m.blankB;
      out.scrollIntoView({behavior:'smooth',block:'center'});return;
    }
    var covered = (place==='state'||place==='az'||place==='nv'||place==='mpw'||place==='onsite');
    var dwPlace = (place==='state'||place==='az'||place==='nv');
    var datesFail = (years==='after'||years==='short');
    var datesUnsure = (years==='dunno');
    var h='', b='', tone='';

    if(place==='mtco'){
      h=m.mtcoH; b=m.mtcoB;
    } else if(place==='notcov'){
      h=m.notcovH; b=m.notcovB;
    } else if(ill==='notlisted'){
      h=m.notlistedH; b=m.notlistedB;
    } else if(ill==='melanoma'){
      h=m.melanomaH; b=m.melanomaB;
    } else if((dwPlace||place==='dunno') && datesFail && ur!=='yes'){
      h=m.yearsH; b=m.yearsB;
    } else if(place==='dunno'){
      h=m.dunnoH; b=m.dunnoB; tone=' good';
    } else if(!covered && ur==='no'){
      h=m.nofitH; b=m.nofitB;
    } else if(!covered && ur==='dunno'){
      h=m.urH; b=m.urB;
    } else {
      tone=' good';
      h=m.goodH; b=m.goodB;
      if(datesUnsure&&dwPlace){b+=m.datesPin;}
      if(place==='mpw'){b+=m.mpw;}
      if(ur==='yes'&&(ill==='lung'||ill==='listed')){b+=m.urYes;}
      if(who==='survivor'){b+=m.survivor;}
      if(prior==='denied'){b+=m.denied;}
      if(ill==='other'||ur==='dunno'||who==='dunno'){b+=m.unsure;}
    }
    b+=m.free;
    out.className='result on'+tone;
    out.innerHTML='<h3>'+h+'</h3>'+b+'<p style="margin-top:16px"><a class="btn" href="tel:+18012106517">'+m.cta+'</a></p><p class="legal" style="margin-top:14px">'+m.legal+'</p>';
    out.scrollIntoView({behavior:'smooth',block:'center'});
  });
}

var cbEl = document.getElementById('cb');
if (cbEl) {
  cbEl.addEventListener('submit', function(e){
    e.preventDefault();
    var f=new FormData(e.target), o=document.getElementById('cbout');
    var n=(f.get('name')||'').trim(), ph=(f.get('phone')||'').replace(/\D/g,'');
    var m = cbMsg[cbLocale()];
    if(!n||ph.length<10){
      o.className='result on';
      o.innerHTML='<h3>'+m.needH+'</h3>'+m.needB;
      return;
    }
    o.className='result on good';
    o.innerHTML=m.got(n.split(' ')[0].replace(/[<>&]/g,''));
    e.target.querySelectorAll('input,select,button').forEach(function(el){el.disabled=true;});
  });
}
