//src\data\mockData.ts
import type { Tutorial, Category, Ad } from "../types";

export const mockCategories: Category[] = [
  {
    id: "data-recovery",
    name: "Data Recovery",
    description: "Tools and techniques for recovering lost or deleted data",
    icon: "🔄",
    tutorialCount: 8,
  },
  {
    id: "system-repair",
    name: "System Repair",
    description: "Fixing Windows system issues and boot problems",
    icon: "🔧",
    tutorialCount: 12,
  },
  {
    id: "disk-management",
    name: "Disk Management",
    description: "Partitioning, formatting, and disk maintenance tools",
    icon: "💾",
    tutorialCount: 6,
  },
  {
    id: "password-recovery",
    name: "Password Recovery",
    description: "Resetting and recovering Windows passwords",
    icon: "🔐",
    tutorialCount: 4,
  },
  {
    id: "backup-restore",
    name: "Backup & Restore",
    description: "Creating and restoring system backups",
    icon: "💿",
    tutorialCount: 5,
  },
  {
    id: "network-tools",
    name: "Network Tools",
    description: "Network diagnostics and connectivity tools",
    icon: "🌐",
    tutorialCount: 7,
  },
];

export const mockTutorials: Tutorial[] = [
  {
    id: "recover-deleted-files",
    title: "How to Recover Deleted Files with Recuva",
    description:
      "Learn how to use Recuva to recover accidentally deleted files from your computer",
    content: `
# Recovering Deleted Files with Recuva

Recuva is one of the most powerful and user-friendly file recovery tools available in Hiren's BootCD. This tutorial will guide you through the process of recovering deleted files.

## Prerequisites
- Hiren's BootCD or Recuva installed
- Access to the drive containing deleted files
- Sufficient storage space for recovered files

## Step 1: Launch Recuva
1. Boot from Hiren's BootCD
2. Navigate to File Recovery section
3. Select "Recuva" from the tools list
4. Wait for the application to load

## Step 2: Select File Types
- Choose the type of files you want to recover
- Options include: Pictures, Music, Documents, Video, or All Files
- For best results, select the specific file type you're looking for

## Step 3: Choose Location
- Select the drive or folder where files were deleted
- You can choose "I'm not sure" if you're unsure of the exact location
- Recuva will scan the entire drive if needed

## Step 4: Enable Deep Scan
- Check "Enable Deep Scan" for thorough recovery
- This takes longer but finds more files
- Recommended for important file recovery

## Step 5: Start Recovery
- Click "Start" to begin the scanning process
- Monitor the progress bar
- The scan may take several minutes depending on drive size

## Step 6: Review Found Files
- Recuva displays found files with status indicators:
  - Green: Excellent chance of recovery
  - Yellow: Good chance of recovery
  - Red: Poor chance of recovery
- Use the preview feature to verify files

## Step 7: Recover Files
- Select the files you want to recover
- Choose a safe recovery location (different drive recommended)
- Click "Recover" to restore the files

## Tips for Better Recovery
- Stop using the drive immediately after deletion
- Recover to a different drive to avoid overwriting
- Use deep scan for better results
- Check file previews before recovery

## Common Issues
- **Files not found**: Try deep scan or different file types
- **Corrupted files**: Some files may be partially recoverable
- **Slow recovery**: Large drives take longer to scan

## Conclusion
Recuva is an essential tool for file recovery. With proper technique, you can recover most deleted files successfully.
    `,
    category: "data-recovery",
    keywords: ["recuva", "file recovery", "deleted files", "data recovery"],
    author: "Bootpedia Team",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    views: 1250,
    difficulty: "beginner",
    estimatedTime: 15,
    tags: ["recuva", "file recovery", "beginner"],
  },
  {
    id: "fix-windows-boot",
    title: "Fixing Windows Boot Issues with Boot-Repair",
    description:
      "Step-by-step guide to repair Windows boot problems using Hiren's tools",
    content: `
# Fixing Windows Boot Issues

Windows boot problems can be frustrating, but Hiren's BootCD provides several tools to diagnose and fix these issues.

## Common Boot Problems
- Blue Screen of Death (BSOD)
- "Bootmgr is missing" error
- Windows won't start
- Corrupted boot files

## Tools Available
1. **Boot-Repair**: Automatic boot repair tool
2. **EasyBCD**: Boot configuration editor
3. **MBR Fix**: Master Boot Record repair
4. **Windows Recovery Console**: Built-in Windows repair

## Method 1: Using Boot-Repair
1. Boot from Hiren's BootCD
2. Navigate to System Tools > Boot-Repair
3. Select your Windows installation
4. Choose "Recommended repair"
5. Follow the prompts and restart

## Method 2: Manual MBR Repair
1. Open Command Prompt from Hiren's BootCD
2. Run: \`bootrec /fixmbr\`
3. Run: \`bootrec /fixboot\`
4. Run: \`bootrec /rebuildbcd\`
5. Restart the computer

## Method 3: Using EasyBCD
1. Launch EasyBCD from Hiren's tools
2. Add new entry for Windows
3. Configure boot options
4. Save changes and restart

## Advanced Troubleshooting
- Check disk for errors first
- Verify Windows installation integrity
- Use System File Checker (SFC)
- Check hardware compatibility

## Prevention Tips
- Keep Windows updated
- Use reliable antivirus software
- Avoid sudden power loss
- Regular system backups
    `,
    category: "system-repair",
    keywords: ["boot repair", "windows boot", "mbr fix", "system repair"],
    author: "Bootpedia Team",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
    views: 2100,
    difficulty: "intermediate",
    estimatedTime: 25,
    tags: ["boot repair", "windows", "intermediate"],
  },
  {
    id: "partition-disk",
    title: "Disk Partitioning with GParted",
    description:
      "Complete guide to partitioning and managing disk space using GParted",
    content: `
# Disk Partitioning with GParted

GParted is a powerful disk partitioning tool included in Hiren's BootCD. This tutorial covers basic to advanced partitioning operations.

## Understanding Partitions
- **Primary Partition**: Main system partition (max 4 per disk)
- **Extended Partition**: Container for logical partitions
- **Logical Partition**: Partitions within extended partition
- **File Systems**: NTFS, FAT32, EXT4, etc.

## Before You Start
- **Backup all data** - partitioning can cause data loss
- Identify target disk and partitions
- Plan your partition layout
- Ensure sufficient free space

## Step 1: Launch GParted
1. Boot from Hiren's BootCD
2. Navigate to Disk Tools > GParted
3. Select the target disk from dropdown
4. Review current partition layout

## Step 2: Create New Partition
1. Select unallocated space
2. Right-click and choose "New"
3. Set partition size
4. Choose file system (NTFS recommended for Windows)
5. Set partition label
6. Click "Add" to queue operation

## Step 2: Resize Existing Partition
1. Right-click on partition to resize
2. Choose "Resize/Move"
3. Drag handles to adjust size
4. Click "Resize/Move" to queue operation

## Step 3: Format Partition
1. Select target partition
2. Right-click and choose "Format to"
3. Select file system type
4. Set partition label
5. Click "Format" to queue operation

## Step 4: Apply Changes
1. Review all queued operations
2. Click "Edit" > "Apply All Operations"
3. Confirm the changes
4. Wait for operations to complete

## Advanced Operations
- **Copy Partition**: Duplicate entire partition
- **Check Partition**: Verify file system integrity
- **Delete Partition**: Remove partition (data will be lost)
- **Move Partition**: Relocate partition on disk

## Safety Tips
- Never resize system partition while running
- Always backup before major changes
- Use "Preview" to review changes
- Test operations on non-critical data first

## Troubleshooting
- **Operation failed**: Check disk for errors
- **Cannot resize**: Defragment first
- **Data loss**: Use recovery tools immediately
- **Boot issues**: Repair boot configuration

## Best Practices
- Leave some unallocated space for future use
- Align partitions properly for performance
- Use appropriate file system for your needs
- Regular disk maintenance prevents issues
    `,
    category: "disk-management",
    keywords: ["gparted", "partitioning", "disk management", "format"],
    author: "Bootpedia Team",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    views: 1800,
    difficulty: "intermediate",
    estimatedTime: 30,
    tags: ["gparted", "partitioning", "intermediate"],
  },
  {
    id: "reset-windows-password",
    title: "Reset Windows Password with Offline NT Password",
    description:
      "How to reset or remove Windows passwords when you can't log in",
    content: `
# Reset Windows Password

Forgot your Windows password? This tutorial shows how to reset it using Offline NT Password & Registry Editor from Hiren's BootCD.

## When to Use This Method
- Forgotten Windows password
- Locked out of administrator account
- Need to access important files
- Emergency access to Windows system

## ⚠️ Important Warnings
- This method modifies Windows registry
- Always backup important data first
- Some antivirus may flag this as suspicious
- Use only on your own computer

## Step 1: Boot from Hiren's BootCD
1. Insert Hiren's BootCD or USB
2. Boot computer from the media
3. Select "Offline NT Password & Registry Editor"
4. Wait for the tool to load

## Step 2: Select Windows Installation
1. Choose the Windows drive (usually C:)
2. Select the Windows installation
3. Press Enter to continue
4. Wait for registry to load

## Step 3: Choose Action
1. Select "Password reset [sam]"
2. Choose user account to reset
3. Select "Clear (blank) the password"
4. Press 'Y' to confirm

## Step 4: Save Changes
1. Select "Write hive files"
2. Press 'Y' to confirm
3. Wait for changes to save
4. Select "Quit" to exit

## Step 5: Restart Computer
1. Remove Hiren's BootCD
2. Restart the computer
3. Boot normally to Windows
4. Log in with blank password

## Alternative Methods
- **Kon-Boot**: Bypass password without resetting
- **Ophcrack**: Password cracking tool
- **Windows Recovery Console**: Built-in Windows tools

## Security Considerations
- Change password immediately after login
- Enable password complexity requirements
- Use strong, unique passwords
- Consider password manager

## Troubleshooting
- **Tool not found**: Check Hiren's BootCD version
- **Cannot access drive**: Check disk connections
- **Registry errors**: Use Windows Recovery Console
- **Still locked out**: Try different user account

## Prevention
- Write down passwords securely
- Use password hints
- Enable password reset disk
- Regular password updates
    `,
    category: "password-recovery",
    keywords: ["password reset", "windows password", "offline nt", "login"],
    author: "Bootpedia Team",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    views: 3200,
    difficulty: "beginner",
    estimatedTime: 20,
    tags: ["password reset", "windows", "beginner"],
  },
];

export const mockAds: Ad[] = [
  {
    id: "ad-1",
    title: "Premium Hiren's BootCD",
    description: "Get the latest version with additional tools and features",
    imageUrl: "/images/ad-premium.jpg",
    linkUrl: "https://hirens-bootcd.com",
    position: "sidebar",
    isActive: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    clicks: 45,
    impressions: 1200,
  },
  {
    id: "ad-2",
    title: "Data Recovery Services",
    description: "Professional data recovery for critical situations",
    imageUrl: "/images/ad-recovery.jpg",
    linkUrl: "https://datarecovery.com",
    position: "footer",
    isActive: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    clicks: 23,
    impressions: 800,
  },
];
