export const HOME_MENU = [
  {key:'members', title:'सदस्य', color:'#1B5E20'},
  {key:'kisan', title:'किसान', color:'#2E7D32'},
  {key:'agent', title:'एजेंट', color:'#33691E'},
  {key:'operator', title:'ऑपरेटर', color:'#0D47A1'},
  {key:'helper', title:'हेल्पर', color:'#1565C0'},
  {key:'dealer', title:'डीलर', color:'#4A148C'},
  {key:'parts', title:'पार्ट्स विक्रेता', color:'#6A1B9A'},
  {key:'mechanic', title:'मैकेनिक', color:'#EF6C00'},
];
export const SETTING_MENU = [
  {key:'notice', title:'सूचना / नोटिस', color:'#9C27B0'},
  {key:'language', title:'🌐 भाषा बदलें / Change Language', color:'#0D47A1'},
  {key:'theme', title:'🎨 कलर और स्टाइल', color:'#EF6C00'},
  {key:'logout', title:'लॉग आउट', color:'#616161'},
];
export const ALL_MENU = [...HOME_MENU, ...SETTING_MENU];
export const HINDI = {
  members:{name:'नाम',mobile:'मोबाइल',pata:'पता'}, kisan:{name:'नाम',mobile:'मोबाइल'},
  agent:{name:'नाम',mobile:'मोबाइल'}, operator:{name:'नाम',mobile:'मोबाइल'},
  helper:{name:'नाम',mobile:'मोबाइल'}, dealer:{name:'नाम',mobile:'मोबाइल'},
  parts:{name:'नाम',mobile:'मोबाइल'}, mechanic:{name:'नाम',mobile:'मोबाइल'},
  notice:{vishay:'विषय',vivaran:'विवरण',mobile:'मोबाइल'}
};
export const FULL = {
  members:{name:'',mobile:'',pata:'',block:'',jila:'',pad:''},
  kisan:{name:'',mobile:'',pata:''}, agent:{name:'',mobile:'',pata:''},
  operator:{name:'',mobile:'',pata:''}, helper:{name:'',mobile:'',pata:''},
  dealer:{name:'',mobile:'',pata:''}, parts:{name:'',mobile:'',pata:''},
  mechanic:{name:'',mobile:'',pata:''}, notice:{vishay:'',vivaran:'',mobile:'',tarikh:''}
};
export const ENG_MENU = {
  members:'Member', kisan:'Farmer', agent:'Agent', operator:'Operator',
  helper:'Helper', dealer:'Dealer', parts:'Parts Seller', mechanic:'Mechanic',
  notice:'Notice', home:'Home', expense:'Expense', due:'Due Amount', settings:'Settings', logout:'Logout'
};
export const THEME_COLORS = ['#2E7D32','#0D47A1','#9C27B0','#EF6C00','#D32F2F','#00897B','#5D4037'];
