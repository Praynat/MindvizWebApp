export const initialNodes = [
    // Root Node
    { id: '1', type: 'rounded', position: { x: 0, y: 0 }, data: { label: 'Nathan', size: 'large' } },
  
    // Main Categories
    { id: '2', type: 'rounded', position: { x: -200, y: 150 }, data: { label: 'Well-being', size: 'medium' } },
    { id: '3', type: 'rounded', position: { x: 0, y: 150 }, data: { label: 'Work', size: 'medium' } },
    { id: '4', type: 'rounded', position: { x: 200, y: 150 }, data: { label: 'Family & Relationships', size: 'medium' } },
    { id: '5', type: 'rounded', position: { x: -200, y: 350 }, data: { label: 'Finances', size: 'medium' } },
    { id: '6', type: 'rounded', position: { x: 0, y: 350 }, data: { label: 'Hobbies & Passions', size: 'medium' } },
    { id: '7', type: 'rounded', position: { x: 200, y: 350 }, data: { label: 'Learning & Development', size: 'medium' } },
    { id: '8', type: 'rounded', position: { x: 0, y: 550 }, data: { label: 'Home & Daily Life', size: 'medium' } },
  
    // Subcategories and Tasks for Well-being
    { id: '9', type: 'rounded', position: { x: -300, y: 300 }, data: { label: 'Physical Health', size: 'small' } },
    { id: '10', type: 'rounded', position: { x: -400, y: 450 }, data: { label: 'Go Jogging', size: 'small' } },
    { id: '11', type: 'rounded', position: { x: -300, y: 450 }, data: { label: 'Meditate for 15 Minutes', size: 'small' } },
  
    // Subcategories and Tasks for Work
    { id: '12', type: 'rounded', position: { x: 0, y: 300 }, data: { label: 'Projects', size: 'small' } },
    { id: '13', type: 'rounded', position: { x: -100, y: 450 }, data: { label: 'Finish Quarterly Report', size: 'small' } },
  
    // Subcategories and Tasks for Family & Relationships
    { id: '14', type: 'rounded', position: { x: 200, y: 300 }, data: { label: 'Social Bonds', size: 'small' } },
    { id: '15', type: 'rounded', position: { x: 150, y: 450 }, data: { label: 'Call Parents', size: 'small' } },
    { id: '16', type: 'rounded', position: { x: 250, y: 450 }, data: { label: 'Plan Family Outing', size: 'small' } },
  
    // Subcategories and Tasks for Finances
    { id: '17', type: 'rounded', position: { x: -300, y: 500 }, data: { label: 'Financial Tasks', size: 'small' } },
    { id: '18', type: 'rounded', position: { x: -400, y: 650 }, data: { label: 'Pay Electricity Bill', size: 'small' } },
    { id: '19', type: 'rounded', position: { x: -300, y: 650 }, data: { label: 'Budget Planning', size: 'small' } },
  
    // Subcategories and Tasks for Hobbies & Passions
    { id: '20', type: 'rounded', position: { x: 0, y: 500 }, data: { label: 'Creative Activities', size: 'small' } },
    { id: '21', type: 'rounded', position: { x: -50, y: 650 }, data: { label: 'Learn Guitar', size: 'small' } },
    { id: '22', type: 'rounded', position: { x: 50, y: 650 }, data: { label: 'Start a Painting', size: 'small' } },
  
    // Subcategories and Tasks for Learning & Development
    { id: '23', type: 'rounded', position: { x: 300, y: 500 }, data: { label: 'Education', size: 'small' } },
    { id: '24', type: 'rounded', position: { x: 250, y: 650 }, data: { label: 'Complete SQL Course', size: 'small' } },
    { id: '25', type: 'rounded', position: { x: 350, y: 650 }, data: { label: 'Read "Atomic Habits"', size: 'small' } },
  
    // Subcategories and Tasks for Home & Daily Life
    { id: '26', type: 'rounded', position: { x: 0, y: 600 }, data: { label: 'Household Tasks', size: 'small' } },
    { id: '27', type: 'rounded', position: { x: -50, y: 750 }, data: { label: 'Clean the House', size: 'small' } },
    { id: '28', type: 'rounded', position: { x: 50, y: 750 }, data: { label: 'Grocery Shopping', size: 'small' } },
  ];

  export const initialEdges = [
    // Root to Main Categories
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e1-4', source: '1', target: '4' },
    { id: 'e1-5', source: '1', target: '5' },
    { id: 'e1-6', source: '1', target: '6' },
    { id: 'e1-7', source: '1', target: '7' },
    { id: 'e1-8', source: '1', target: '8' },
  
    // Well-being to Subcategories and Tasks
    { id: 'e2-9', source: '2', target: '9' },
    { id: 'e9-10', source: '9', target: '10' },
    { id: 'e9-11', source: '9', target: '11' },
  
    // Work to Subcategories and Tasks
    { id: 'e3-12', source: '3', target: '12' },
    { id: 'e12-13', source: '12', target: '13' },
  
    // Family & Relationships
    { id: 'e4-14', source: '4', target: '14' },
    { id: 'e14-15', source: '14', target: '15' },
    { id: 'e14-16', source: '14', target: '16' },
  
    // Finances
    { id: 'e5-17', source: '5', target: '17' },
    { id: 'e17-18', source: '17', target: '18' },
    { id: 'e17-19', source: '17', target: '19' },
  
    // Hobbies & Passions
    { id: 'e6-20', source: '6', target: '20' },
    { id: 'e20-21', source: '20', target: '21' },
    { id: 'e20-22', source: '20', target: '22' },
  
    // Learning & Development
    { id: 'e7-23', source: '7', target: '23' },
    { id: 'e23-24', source: '23', target: '24' },
    { id: 'e23-25', source: '23', target: '25' },
  
    // Home & Daily Life
    { id: 'e8-26', source: '8', target: '26' },
    { id: 'e26-27', source: '26', target: '27' },
    { id: 'e26-28', source: '26', target: '28' },
  ];
  