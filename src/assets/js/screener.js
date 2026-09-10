document.getElementById('screener').addEventListener('submit', function(e){
  e.preventDefault();
  var f=new FormData(e.target), out=document.getElementById('out');
  var place=f.get('place'), years=f.get('years'), ur=f.get('uranium'), ill=f.get('illness'), who=f.get('who'), prior=f.get('prior');
  if(!place||!years||!ur||!ill||!who||!prior){
    out.className='result on';
    out.innerHTML='<h3>A couple are still blank</h3><p>Answer all six and we will give you a read. If you are not sure about one, pick "I am not sure." That is a real answer here.</p>';
    out.scrollIntoView({behavior:'smooth',block:'center'});return;
  }
  var covered = (place==='state'||place==='az'||place==='nv'||place==='mpw'||place==='onsite');
  var dwPlace = (place==='state'||place==='az'||place==='nv');
  var datesFail = (years==='after'||years==='short');
  var datesUnsure = (years==='dunno');
  var h='', b='', tone='';

  if(place==='mtco'){
    h='Montana, Colorado, and Guam are not covered right now.';
    b='<p>We would rather tell you straight. Those were taken out of the bill before it passed. A new bill to add them was introduced in July 2026, but it has not become law, and we are not going to sign you up for something that does not exist yet.</p><p>If there was <strong>uranium work</strong> in the family, that is a separate category and it may still apply no matter where you lived. Worth a call if so.</p>';
  } else if(place==='notcov'){
    h='That part of Arizona or Nevada is not covered.';
    b='<p>Only certain counties qualify. Arizona is Coconino, Yavapai, Navajo, Apache, Gila, and Mohave. Nevada is Eureka, Lander, Lincoln, Nye, White Pine, and the northeast corner of Clark county only, the Moapa, Overton, Logandale, Bunkerville and Mesquite area. Phoenix, Tucson, and Las Vegas are not on the list.</p><p>Two things worth checking before you let this go. Did the family live somewhere else during those years? And was there any <strong>uranium work</strong>? That is a separate category with different rules.</p>';
  } else if(ill==='notlisted'){
    h='That diagnosis is not on any of the covered lists.';
    b='<p>Prostate, cervical, testicular and uterine cancer, and Hodgkin\u2019s disease, are not on the downwinder list, the uranium worker list, or the Manhattan Project waste list. We would rather tell you that in two minutes than in a year.</p><p>If there is a <strong>second diagnosis</strong> in the family, or a different family member who was sick, that can be a completely different answer. That is worth a call.</p>';
  } else if(ill==='melanoma'){
    h='Melanoma is not on the covered list.';
    b='<p>This is a hard one and we would rather say it now than in a year. Melanoma does not qualify under this program in any category.</p><p>If there is a second diagnosis in the family, that may be a different story.</p>';
  } else if((dwPlace||place==='dunno') && datesFail && ur!=='yes'){
    h='The years are the problem here, not the place.';
    b='<p>The county is right, but the program is tied to a specific window. A person has to have been physically present for <strong>at least one year between January 21, 1951 and November 6, 1962</strong>, or for the entire month of July 1962. New Mexico reaches further back, to September 24, 1944, because of the Trinity test.</p><p>Someone who arrived after November 1962 does not qualify as a downwinder, in any covered county.</p><p>Two things still worth checking. Were a <strong>parent or grandparent</strong> there during those years? Their claim can pass to family. And was there any <strong>uranium work</strong>? That is a separate category and these dates do not apply to it.</p>';
  } else if(place==='dunno'){
    h='Let us look it up with you.';
    b='<p>County lines are exactly where people rule themselves out by mistake, and it is the easiest thing in the world for us to check. Call and tell us the town. It takes about two minutes and it costs nothing.</p>';
    tone=' good';
  } else if(!covered && ur==='no'){
    h='Based on this, it does not look like a fit.';
    b='<p>The program is tied to specific places and specific work. If neither applies, there is probably nothing here.</p><p>If you are unsure where a parent or grandparent actually lived or worked in those years, that is worth ten minutes on the phone before you close the door on it.</p>';
  } else if(!covered && ur==='dunno'){
    h='It depends on the uranium question.';
    b='<p>The location does not qualify on its own, but uranium work is a separate route in. If anyone in the family mined, milled, or hauled ore, this could still apply. Ask the family, then call us.</p>';
  } else {
    tone=' good';
    h='This looks worth a conversation.';
    b='<p>You have the two things that matter most: a place or work history the program covers, and a health condition in a category it recognizes.</p>';
    if(datesUnsure&&dwPlace){b+='<p><strong>The years are the one thing left to pin down.</strong> Presence has to fall between January 1951 and November 1962, or September 1944 in New Mexico. If you are not certain, do not guess. Old tax, school, church and voting records settle it, and finding them is the part we do.</p>';}
    if(place==='mpw'){b+='<p><strong>Manhattan Project waste claims work differently.</strong> They pay $50,000 or $25,000 rather than $100,000, they use a longer condition list that includes bone and kidney cancer, and the illness has to have begun at least two years after exposure.</p>';}
    if(ur==='yes'&&(ill==='lung'||ill==='listed')){b+='<p><strong>Worth knowing.</strong> Uranium workers are covered for lung and kidney conditions, not only cancer. Silicosis, pulmonary fibrosis, nephritis. A lot of families rule themselves out right here by mistake.</p>';}
    if(who==='survivor'){b+='<p><strong>Worth knowing.</strong> A spouse, child, parent, or in some cases grandchild can file. Many families assume the door closed when their parent did. It did not.</p>';}
    if(prior==='denied'){b+='<p><strong>You mentioned a denial.</strong> That is often a paperwork gap rather than an eligibility problem. Bring the denial letter to the call.</p>';}
    if(ill==='other'||ur==='dunno'||who==='dunno'){b+='<p>Some of your answers were "not sure," which is completely normal. We can sort those out on the phone.</p>';}
  }
  b+='<p><strong>You can do this yourself, for free.</strong> RESEP clinics help at no cost and plenty of families file with no company at all. If you would rather not chase forty years of records, that is what we are for.</p>';
  out.className='result on'+tone;
  out.innerHTML='<h3>'+h+'</h3>'+b+'<p style="margin-top:16px"><a class="btn" href="tel:+18014008270">Talk it through, (801) 400-8270</a></p><p class="legal" style="margin-top:14px">This is a general read, not a decision. Only the Department of Justice decides who qualifies.</p>';
  out.scrollIntoView({behavior:'smooth',block:'center'});
});

document.getElementById('cb').addEventListener('submit', function(e){
  e.preventDefault();
  var f=new FormData(e.target), o=document.getElementById('cbout');
  var n=(f.get('name')||'').trim(), ph=(f.get('phone')||'').replace(/\D/g,'');
  if(!n||ph.length<10){
    o.className='result on';
    o.innerHTML='<h3>We need a name and a phone number</h3><p>Ten digits is enough. If you would rather just call, the number is (801) 400-8270.</p>';
    return;
  }
  o.className='result on good';
  o.innerHTML='<h3>Got it, '+n.split(' ')[0].replace(/[<>&]/g,'')+'.</h3><p>Someone will call you within one business day. If we miss you, we keep trying.</p><p>Nothing happens until you say so, and you can tell us to delete your number at any point.</p>';
  e.target.querySelectorAll('input,select,button').forEach(function(el){el.disabled=true;});
});
